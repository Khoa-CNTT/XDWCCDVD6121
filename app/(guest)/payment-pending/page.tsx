"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Get the transaction ID from localStorage
    const storedTransactionId = localStorage.getItem("payosTransactionId");
    if (storedTransactionId) {
      setTransactionId(parseInt(storedTransactionId));
    }
    setLoading(false);
  }, []);

  const checkPaymentStatus = async () => {
    if (!transactionId) {
      toast.error("Không tìm thấy thông tin giao dịch");
      return;
    }

    setChecking(true);
    try {
      const response = await fetch(
        `/api/payos/check-status?transactionId=${transactionId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi kiểm tra trạng thái thanh toán");
      }

      if (data.status.toUpperCase() === "PAID") {
        toast.success("Thanh toán đã được xác nhận thành công!");
        router.push("/payment-success");
      } else {
        toast.info(`Trạng thái thanh toán: ${data.vietnameseStatus}`);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi kiểm tra thanh toán"
      );
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Đang tải...
          </h1>
        </div>
      </div>
    );
  }

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
          Đang chờ xác nhận thanh toán
        </h1>
        <div className="mt-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Chúng tôi đang chờ xác nhận thanh toán từ cổng thanh toán.
          </p>
          {orderId && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Mã đơn hàng: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Nếu bạn đã hoàn thành thanh toán, hãy nhấn nút bên dưới để kiểm tra
            trạng thái.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={checkPaymentStatus}
            disabled={checking}
            className={`block w-full py-3 px-4 ${
              checking ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"
            } text-white rounded-md text-center transition-colors`}
          >
            {checking ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                Đang kiểm tra...
              </span>
            ) : (
              "Kiểm tra trạng thái thanh toán"
            )}
          </button>
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
