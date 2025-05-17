import crypto from "crypto";
import axios from "axios";

// Constants
const PAYOS_API_URL = "https://api-merchant.payos.vn/v2/payment-requests";
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Utility function to generate a unique order code
export function generateOrderCode() {
  // Generate a smaller, safer number for Payos (avoid exceeding 9007199254740991)
  return Math.floor(Math.random() * 1000000000) + 1; // 9-digit number
}

// Create HMAC signature for Payos request
export function createSignature(data: Record<string, any>) {
  try {
    const signatureFields = [
      "amount",
      "cancelUrl",
      "description",
      "orderCode",
      "returnUrl",
    ];

    const signatureString = signatureFields
      .map((field) => `${field}=${data[field] || ""}`)
      .join("&");

    return crypto
      .createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY || "")
      .update(signatureString)
      .digest("hex");
  } catch (error) {
    console.error("Error creating signature:", error);
    throw new Error("Failed to create payment signature");
  }
}

// Define interface with additional signature property
interface PayosPayload {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  signature?: string;
}

// Create a Payos payment
export async function createPayosPayment(
  amount: number,
  description: string,
  buyerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }
) {
  // Check if Payos credentials are available
  if (
    !process.env.PAYOS_API_KEY ||
    !process.env.PAYOS_CHECKSUM_KEY ||
    !process.env.PAYOS_CLIENT_ID
  ) {
    throw new Error("Payos configuration is missing");
  }

  // Calculate processing fee (1.5%)
  const originalAmount = amount;
  const processingFee = Math.ceil(originalAmount * 0.015);
  const totalAmount = originalAmount + processingFee;

  const orderCode = generateOrderCode();
  const payload: PayosPayload = {
    orderCode: orderCode, // Send as number, not string
    amount: totalAmount,
    description: description.substring(0, 25), // Limit description to 25 chars
    cancelUrl: `${DOMAIN}/api/payos/cancel?orderId=${orderCode}`,
    returnUrl: `${DOMAIN}/api/payos/return?orderId=${orderCode}`,
    buyerName: buyerInfo.name || "",
    buyerEmail: buyerInfo.email || "",
    buyerPhone: buyerInfo.phone || "",
    buyerAddress: buyerInfo.address || "",
  };

  // Create signature and add to payload
  payload.signature = createSignature(payload);

  try {
    // Make API call to Payos
    const response = await axios.post(PAYOS_API_URL, payload, {
      headers: {
        "x-client-id": process.env.PAYOS_CLIENT_ID,
        "x-api-key": process.env.PAYOS_API_KEY,
      },
    });

    if (response.data.code === "00" && response.data.data) {
      return {
        success: true,
        orderCode: orderCode,
        checkoutUrl: response.data.data.checkoutUrl,
        qrCode: response.data.data.qrCode,
        paymentLinkId: response.data.data.paymentLinkId,
        originalAmount,
        processingFee,
        totalAmount,
      };
    } else {
      throw new Error(response.data.desc || "Unknown Payos error");
    }
  } catch (error) {
    console.error("Error creating Payos payment:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    } else {
      throw new Error("Failed to create payment: Unknown error");
    }
  }
}

// Check Payos payment status
export async function checkPayosPaymentStatus(paymentLinkId: string) {
  if (!process.env.PAYOS_API_KEY || !process.env.PAYOS_CLIENT_ID) {
    throw new Error("Payos configuration is missing");
  }

  const apiUrl = `https://api-merchant.payos.vn/v2/payment-requests/${paymentLinkId}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "x-client-id": process.env.PAYOS_CLIENT_ID,
        "x-api-key": process.env.PAYOS_API_KEY,
      },
    });

    if (response.data.code === "00" && response.data.data) {
      const paymentInfo = response.data.data;
      const status = paymentInfo.status;
      let vietnameseStatus = "";

      switch (status.toUpperCase()) {
        case "PENDING":
          vietnameseStatus = "Chưa thanh toán";
          break;
        case "PAID":
          vietnameseStatus = "Đã thanh toán";
          break;
        case "CANCELLED":
          vietnameseStatus = "Đã hủy";
          break;
        case "EXPIRED":
          vietnameseStatus = "Đã hết hạn";
          break;
        default:
          vietnameseStatus = "Không xác định";
      }

      return {
        success: true,
        status: status,
        vietnameseStatus: vietnameseStatus,
        amount: paymentInfo.amount,
        orderCode: paymentInfo.orderCode,
        paymentLinkId: paymentInfo.paymentLinkId,
      };
    } else {
      throw new Error(
        response.data.desc || "Không thể lấy thông tin thanh toán"
      );
    }
  } catch (error) {
    console.error("Error in checkPayosPaymentStatus:", error);
    if (error instanceof Error) {
      return {
        success: false,
        message: `Không thể kiểm tra trạng thái thanh toán: ${error.message}`,
        code: (error as any).response?.status,
      };
    } else {
      return {
        success: false,
        message: "Không thể kiểm tra trạng thái thanh toán: Unknown error",
      };
    }
  }
}

// Cancel a Payos payment
export async function cancelPayosPayment(paymentLinkId: string) {
  if (!process.env.PAYOS_API_KEY || !process.env.PAYOS_CLIENT_ID) {
    throw new Error("Payos configuration is missing");
  }

  const apiUrl = `https://api-merchant.payos.vn/v2/payment-requests/${paymentLinkId}/cancel`;

  try {
    const response = await axios.post(
      apiUrl,
      {},
      {
        headers: {
          "x-client-id": process.env.PAYOS_CLIENT_ID,
          "x-api-key": process.env.PAYOS_API_KEY,
        },
      }
    );

    if (response.data.code === "00") {
      return {
        success: true,
        message: "Đơn hàng đã được hủy thành công",
      };
    } else {
      throw new Error(response.data.desc || "Không thể hủy đơn hàng");
    }
  } catch (error) {
    console.error("Error in cancelPayosPayment:", error);
    if (error instanceof Error) {
      return {
        success: false,
        message: `Không thể hủy đơn hàng: ${error.message}`,
        code: (error as any).response?.status,
      };
    } else {
      return {
        success: false,
        message: "Không thể hủy đơn hàng: Unknown error",
      };
    }
  }
}
