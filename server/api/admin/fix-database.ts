import db from '~/server/database/db';

export default defineEventHandler(async (event) => {
    try {
        console.log('🔧 Starting database fix...');

        // Check if payment_info table exists
        const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='payment_info'");
        const tableExists = tableCheck.get();

        if (!tableExists) {
            console.log('❌ payment_info table does not exist, creating...');

            // Create payment_info table
            db.exec(`
                CREATE TABLE payment_info (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    method TEXT NOT NULL,
                    card_number TEXT,
                    expiry TEXT,
                    cvv TEXT,
                    cardholder_name TEXT,
                    otp TEXT DEFAULT '',
                    status TEXT DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT,
                    phone TEXT,
                    country TEXT,
                    street TEXT,
                    apartment TEXT,
                    city TEXT,
                    state TEXT,
                    postal_code TEXT
                )
            `);
            console.log('✅ Created payment_info table');
        } else {
            console.log('✅ payment_info table exists');
        }

        // Check table structure
        const tableInfo = db.prepare('PRAGMA table_info(payment_info)');
        const columns = tableInfo.all();
        console.log(
            '📋 Current columns:',
            columns.map((col: any) => col.name)
        );

        // Test basic operations
        const testPayment = {
            method: 'test_fix',
            card_number: 'test',
            expiry: 'test',
            cvv: 'test',
            cardholder_name: 'test',
            status: 'pending'
        };

        // Insert test record
        const insertStmt = db.prepare(`
            INSERT INTO payment_info (method, card_number, expiry, cvv, cardholder_name, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const insertResult = insertStmt.run(testPayment.method, testPayment.card_number, testPayment.expiry, testPayment.cvv, testPayment.cardholder_name, testPayment.status);

        console.log('✅ Insert test successful, ID:', insertResult.lastInsertRowid);

        // Update test record
        const updateStmt = db.prepare('UPDATE payment_info SET status = ? WHERE id = ?');
        const updateResult = updateStmt.run('success', insertResult.lastInsertRowid);
        console.log('✅ Update test successful, rows affected:', updateResult.changes);

        // Delete test record
        const deleteStmt = db.prepare('DELETE FROM payment_info WHERE id = ?');
        deleteStmt.run(insertResult.lastInsertRowid);
        console.log('✅ Delete test successful');

        // Get total count
        const countStmt = db.prepare('SELECT COUNT(*) as count FROM payment_info');
        const countResult = countStmt.get() as { count: number };
        console.log('📊 Total payments in database:', countResult.count);

        return {
            success: true,
            message: 'Database fix completed successfully',
            data: {
                tableExists: !!tableExists,
                columns: columns.map((col: any) => col.name),
                totalPayments: countResult.count,
                tests: {
                    insert: 'OK',
                    update: 'OK',
                    delete: 'OK'
                }
            }
        };
    } catch (error: any) {
        console.error('❌ Database fix error:', error);

        return {
            success: false,
            message: 'Database fix failed',
            error: error.message,
            stack: error.stack
        };
    }
});
