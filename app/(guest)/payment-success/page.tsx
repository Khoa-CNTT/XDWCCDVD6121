"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface OrderDetails {
  orderId: number;
  orderCode: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    type: string;
    startDate?: string;
    endDate?: string;
    ngay_hen?: string;
  }>;
  totalAmount: number;
  email: string;
  phone: string;
  address: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const createOrder = async () => {
      try {
        // Get cart items and transaction ID from local storage
        const cartItems = localStorage.getItem("cartItems");
        const transactionId = localStorage.getItem("payosTransactionId");
        const shippingInfo = localStorage.getItem("shippingInfo");

        if (!cartItems || !transactionId || !shippingInfo) {
          console.error("Missing data:", {
            cartItems: !!cartItems,
            transactionId: !!transactionId,
            shippingInfo: !!shippingInfo,
          });
          toast.error("Thông tin đơn hàng không đầy đủ");
          setLoading(false);
          return;
        }

        const requestData = {
          transactionId: parseInt(transactionId),
          cartItems: JSON.parse(cartItems),
          shippingInfo: JSON.parse(shippingInfo),
        };

        // console.log("Creating order with data:", requestData);

        // Create the order using the transaction
        const response = await fetch("/api/payos/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.error("Error response:", responseData);
          throw new Error(responseData.error || "Lỗi khi tạo đơn hàng");
        }

        // Save order details and clear cart
        localStorage.setItem("lastOrderDetails", JSON.stringify(responseData));
        localStorage.removeItem("cartItems");
        localStorage.removeItem("payosTransactionId");
        localStorage.removeItem("shippingInfo");

        setOrderDetails(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xử lý đơn hàng"
        );
        setLoading(false);
      }
    };

    createOrder();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Đang xử lý đơn hàng...
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Vui lòng chờ trong giây lát.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Thanh toán thành công!
        </h1>
        {orderDetails && (
          <div className="mt-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Cảm ơn bạn đã đặt hàng tại Wedding Shop.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Mã đơn hàng của bạn là:{" "}
              <span className="font-semibold">{orderDetails.orderCode}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Chúng tôi đã gửi email xác nhận đơn hàng đến{" "}
              <span className="font-semibold">{orderDetails.email}</span>
            </p>
          </div>
        )}
        <div className="mt-8 space-y-4">
          <Link
            href="/search-order"
            className="block w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-center transition-colors"
          >
            Kiểm tra đơn hàng
          </Link>
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-center transition-colors"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
