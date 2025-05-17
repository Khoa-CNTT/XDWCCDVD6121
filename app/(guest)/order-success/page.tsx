"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderDetails {
  orderCode: string;
  customerName: string;
  email: string;
}

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Clear the cart after successful order
    localStorage.removeItem("cartItems");

    // Get order details from localStorage if available
    const details = localStorage.getItem("lastOrderDetails");
    if (details) {
      setOrderDetails(JSON.parse(details));
      // Clear the details after loading
      localStorage.removeItem("lastOrderDetails");
    }
  }, []);

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
          Đặt hàng thành công!
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
