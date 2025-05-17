import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { PaymentStatus } from "@prisma/client";
import { cancelPayosPayment } from "@/app/services/payos.service";

// GET handler for redirect from PayOS
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    // Find the transaction with this orderId
    const transaction = await prisma.transaction.findFirst({
      where: {
        orderCode: orderId.toString(),
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Cancel the payment
    if (transaction.payos_payment_link_id) {
      await cancelPayosPayment(transaction.payos_payment_link_id);
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        payment_status: PaymentStatus.FAILED,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancelled`
    );
  } catch (error) {
    console.error("Error in Payos cancel handler:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment-error?error=${encodeURIComponent("An error occurred while cancelling payment")}`
    );
  }
}

// POST handler for direct cancellation from frontend
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentLinkId = searchParams.get("paymentLinkId");

  if (!paymentLinkId) {
    return NextResponse.json(
      { success: false, message: "Missing paymentLinkId" },
      { status: 400 }
    );
  }

  try {
    const result = await cancelPayosPayment(paymentLinkId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in cancel payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Không thể hủy đơn hàng: ${error.message}`,
        code: error.response?.status,
      },
      { status: error.response?.status || 500 }
    );
  }
}
