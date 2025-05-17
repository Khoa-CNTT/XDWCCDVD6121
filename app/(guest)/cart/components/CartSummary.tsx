"use client";

import { CartItem } from "../types";

interface CartSummaryProps {
  cartItems: CartItem[];
  onCheckout: () => void;
}

export function CartSummary({ cartItems, onCheckout }: CartSummaryProps) {
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateItemTotal = (item: CartItem) => {
    switch (item.type) {
      case "VAYCUOI":
        return item.vayInfo.gia * calculateDays(item.startDate, item.endDate);
      case "RAPCUOI":
        return (
          item.rapInfo.gia_thue * calculateDays(item.startDate, item.endDate)
        );
      case "MAKEUP":
        return item.makeupInfo.gia_makeup;
      default:
        return 0;
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  return (
    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">Tổng tiền:</span>
        <span className="text-lg font-semibold">
          {getTotalAmount().toLocaleString("vi-VN")}đ
        </span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
      >
        Tiến hành đặt hàng
      </button>
    </div>
  );
}
