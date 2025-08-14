import db from '~/server/database/db';

export default defineEventHandler(async (event) => {
    try {
        // Get products from database
        const stmt = db.prepare('SELECT * FROM product ORDER BY id DESC');
        const products = stmt.all() as any[];

        return {
            success: true,
            data: products
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});
