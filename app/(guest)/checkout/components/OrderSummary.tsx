"use client";

import Image from "next/image";
import { CartItem } from "../types";

interface OrderSummaryProps {
  cartItems: CartItem[];
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function OrderSummary({
  cartItems,
  isSubmitting,
  onSubmit,
}: OrderSummaryProps) {
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

  const getItemImage = (item: CartItem): string => {
    switch (item.type) {
      case "VAYCUOI":
        return item.vayInfo.anh;
      case "RAPCUOI":
        return item.rapInfo.anh_rap;
      case "MAKEUP":
        return item.makeupInfo.anh_makeup;
      default:
        return "/placeholder.jpg";
    }
  };

  const getItemName = (item: CartItem): string => {
    switch (item.type) {
      case "VAYCUOI":
        return item.vayInfo.ten;
      case "RAPCUOI":
        return item.rapInfo.ten_rap;
      case "MAKEUP":
        return item.makeupInfo.ten_makeup;
      default:
        return "Sản phẩm không xác định";
    }
  };

  const getItemDetails = (item: CartItem): JSX.Element => {
    switch (item.type) {
      case "VAYCUOI":
        return (
          <div className="text-sm text-gray-600">
            <p>
              Ngày bắt đầu:{" "}
              {new Date(item.startDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              Ngày kết thúc:{" "}
              {new Date(item.endDate).toLocaleDateString("vi-VN")}
            </p>
            <p>Số ngày thuê: {calculateDays(item.startDate, item.endDate)}</p>
            <p>Giá thuê/ngày: {item.vayInfo.gia.toLocaleString("vi-VN")}đ</p>
          </div>
        );
      case "RAPCUOI":
        return (
          <div className="text-sm text-gray-600">
            <p>
              Ngày bắt đầu:{" "}
              {new Date(item.startDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              Ngày kết thúc:{" "}
              {new Date(item.endDate).toLocaleDateString("vi-VN")}
            </p>
            <p>Số ngày thuê: {calculateDays(item.startDate, item.endDate)}</p>
            <p>
              Giá thuê/ngày: {item.rapInfo.gia_thue.toLocaleString("vi-VN")}đ
            </p>
            {item.rapInfo.mau && <p>Màu: {item.rapInfo.mau}</p>}
            {item.rapInfo.soGhe && <p>Số ghế: {item.rapInfo.soGhe}</p>}
            {item.rapInfo.soDayGhe && (
              <p>Số dãy ghế: {item.rapInfo.soDayGhe}</p>
            )}
          </div>
        );
      case "MAKEUP":
        return (
          <div className="text-sm text-gray-600">
            <p>
              Ngày hẹn: {new Date(item.ngay_hen).toLocaleDateString("vi-VN")}
            </p>
            <p>
              Giá dịch vụ: {item.makeupInfo.gia_makeup.toLocaleString("vi-VN")}đ
            </p>
            {item.makeupInfo.phong_cach && (
              <p>Phong cách: {item.makeupInfo.phong_cach}</p>
            )}
            {item.makeupInfo.chi_tiet && (
              <p>Chi tiết: {item.makeupInfo.chi_tiet}</p>
            )}
          </div>
        );
      default:
        return <></>;
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Đơn hàng của bạn
      </h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={getItemImage(item)}
                alt={getItemName(item)}
                width={64}
                height={64}
                quality={70}
                className="object-cover w-full h-full rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {getItemName(item)}
              </h3>
              {getItemDetails(item)}
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {calculateItemTotal(item).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t dark:border-gray-700 pt-4">
        <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
          <span>Tạm tính</span>
          <span>{getTotalAmount().toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
          <span>Phí vận chuyển</span>
          <span>Miễn phí</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t dark:border-gray-700">
          <span className="text-gray-900 dark:text-white">Tổng cộng</span>
          <span className="text-pink-500 dark:text-pink-400">
            {getTotalAmount().toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-400 
                 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
                 dark:focus:ring-pink-400 dark:focus:ring-offset-gray-800 mt-6"
      >
        {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  );
}
