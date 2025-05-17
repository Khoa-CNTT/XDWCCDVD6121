"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function PaymentCancelledPage() {
  useEffect(() => {
    // Clear payment-related data from localStorage
    localStorage.removeItem("payosTransactionId");
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Thanh toán đã bị hủy
        </h1>
        <div className="mt-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Bạn đã hủy quá trình thanh toán.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Các sản phẩm vẫn còn trong giỏ hàng của bạn nếu bạn muốn thử lại.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/checkout"
            className="block w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-center transition-colors"
          >
            Quay lại thanh toán
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
