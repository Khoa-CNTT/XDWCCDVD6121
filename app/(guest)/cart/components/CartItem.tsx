"use client";

import Image from "next/image";
import { CartItem } from "../types";

interface CartItemComponentProps {
  item: CartItem;
  onRemove: (id: number) => void;
}

export function CartItemComponent({ item, onRemove }: CartItemComponentProps) {
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

  return (
    <div className="flex flex-row items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="relative w-24 h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={getItemImage(item)}
          alt={getItemName(item)}
          width={96}
          height={96}
          quality={75}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-grow space-y-1 my-2">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {getItemName(item)}
        </h3>
        {getItemDetails(item)}
        <p className="font-medium text-pink-600 dark:text-pink-400 mt-1">
          Tổng tiền: {calculateItemTotal(item).toLocaleString("vi-VN")}đ
        </p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-600 self-start mt-2 text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Xóa
      </button>
    </div>
  );
}
