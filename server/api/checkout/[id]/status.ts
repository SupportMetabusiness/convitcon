import db, { type PaymentInfo } from "~/server/database/db";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "GET") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    const id = getRouterParam(event, "id");

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid payment ID",
      });
    }

    const stmt = db.prepare(
      "SELECT id, status, created_at FROM payment_info WHERE id = ?",
    );
    const payment = stmt.get(Number(id)) as
      | Pick<PaymentInfo, "id" | "status" | "created_at">
      | undefined;

    if (!payment) {
      throw createError({
        statusCode: 404,
        statusMessage: "Payment not found",
      });
    }

    return {
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        createdAt: payment.created_at,
      },
    };
  } catch {}
});
