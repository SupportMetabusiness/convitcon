import db from '~/server/database/db';

export default defineEventHandler(async (event) => {
    try {
        const productId = getRouterParam(event, 'id');

        if (!productId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Product ID is required'
            });
        }

        // Get product from database
        const product = db
            .prepare(
                `
            SELECT * FROM product
            WHERE id = ?
        `
            )
            .get(productId) as any;

        if (!product) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Product not found'
            });
        }

        return {
            success: true,
            data: product
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        });
    }
});
