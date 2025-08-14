import db from '~/server/database/db';

export default defineEventHandler(async (event) => {
    const method = getMethod(event);

    if (method === 'GET') {
        try {
            // Get the most recent product to determine default currency
            const stmt = db.prepare('SELECT currency FROM product ORDER BY id DESC LIMIT 1');
            const result = stmt.get() as { currency?: string } | undefined;

            const defaultCurrency = result?.currency || 'USD';

            return {
                success: true,
                data: {
                    defaultCurrency: defaultCurrency
                }
            };
        } catch (error) {
            console.error('Error fetching settings:', error);
            return {
                success: false,
                error: 'Failed to fetch settings'
            };
        }
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event);
            const { defaultCurrency } = body;

            // Update all products to use the new default currency
            const updateStmt = db.prepare('UPDATE product SET currency = ? WHERE currency IS NULL OR currency = ""');
            updateStmt.run(defaultCurrency);

            return {
                success: true,
                message: 'Settings updated successfully'
            };
        } catch (error) {
            console.error('Error updating settings:', error);
            return {
                success: false,
                error: 'Failed to update settings'
            };
        }
    }

    return {
        success: false,
        error: 'Method not allowed'
    };
});
