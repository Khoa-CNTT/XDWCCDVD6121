"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/components/css/datepicker.css";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { toast } from "sonner";

interface RapInfo {
  ten_rap: string;
  anh_rap: string;
  gia_thue: number;
  mau?: string;
  soGhe?: string;
  soDayGhe?: string;
}

interface RapRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (startDate: Date, endDate: Date) => void;
  rapInfo?: RapInfo;
}

const RapRentalModal: React.FC<RapRentalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  rapInfo,
}) => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const handleSubmit = () => {
    if (!startDate || !endDate) return;

    const validationError = getDateValidationError();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    onSubmit(startDate, endDate);
    onClose();
  };

  // Reset dates when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [isOpen]);
  const today = new Date();
  today.setDate(today.getDate() + 2); // Set minimum date to 2 days from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance

  if (!isOpen) return null;

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !rapInfo) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return rapInfo.gia_thue * days;
  };

  // Validation functions
  const isValidDateRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return false;

    // Kiểm tra thời gian thuê tối thiểu và tối đa
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 1 || days > 7) return false;

    // Kiểm tra xem ngày bắt đầu có phải là 2 ngày sau không
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    return start >= twoDaysFromNow;
  };

  const getDateValidationError = () => {
    if (!startDate || !endDate) {
      return "Vui lòng chọn cả ngày thuê và ngày trả";
    }

    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 1) {
      return "Thời gian thuê tối thiểu là 1 ngày";
    }

    if (days > 7) {
      return "Thời gian thuê tối đa là 7 ngày";
    }

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    if (startDate < twoDaysFromNow) {
      return "Vui lòng đặt lịch trước ít nhất 2 ngày";
    }

    if (endDate <= startDate) {
      return "Ngày trả phải sau ngày thuê ít nhất 1 ngày";
    }

    return null;
  };

  const validationError = getDateValidationError();

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="relative bg-white dark:bg-gray-800 w-full max-w-xl mx-auto rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-medium dark:text-white">
            Đặt Thuê Rạp Cưới
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 dark:text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Rap info section */}
          {rapInfo && (
            <div className="mb-6 flex flex-col md:flex-row gap-6">
              {" "}
              {/* Optimized rap image */}
              <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={rapInfo.anh_rap}
                  alt={rapInfo.ten_rap}
                  width={300}
                  height={400}
                  quality={80}
                  className="object-cover w-full h-full"
                  priority={true}
                />
              </div>
              {/* Rap details */}
              <div className="w-full md:w-1/2 space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {rapInfo.ten_rap}
                </h3>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {rapInfo.gia_thue.toLocaleString("vi-VN")}đ/ngày
                </p>
                {rapInfo.mau && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Màu: {rapInfo.mau}
                  </p>
                )}
                {rapInfo.soGhe && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Số ghế: {rapInfo.soGhe}
                  </p>
                )}
                {rapInfo.soDayGhe && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Số dãy ghế: {rapInfo.soDayGhe}
                  </p>
                )}
                {/* Total price calculation */}
                {startDate && endDate && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      Tổng số ngày thuê:{" "}
                      {Math.ceil(
                        (endDate.getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      ngày
                    </p>
                    <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                      Tổng tiền: {calculateTotalPrice().toLocaleString("vi-VN")}
                      đ
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Date selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Ngày Thuê
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={today}
                  maxDate={maxDate}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  placeholderText="Chọn ngày thuê"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Ngày Trả
                </div>{" "}
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={
                    startDate
                      ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                      : today
                  }
                  maxDate={
                    startDate
                      ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                      : maxDate
                  }
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  placeholderText="Chọn ngày trả"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-blue-600 dark:text-blue-300 text-sm">
                <div className="font-medium mb-2">Lưu ý:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Thời gian thuê tối thiểu là 1 ngày</li>
                  <li>Thời gian thuê tối đa là 7 ngày</li>
                  <li>Vui lòng đặt lịch trước ít nhất 2 ngày</li>
                  <li>Ngày trả phải sau ngày thuê ít nhất 1 ngày</li>
                </ul>
              </div>
            </div>

            {/* Validation error message */}
            {validationError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <p className="text-red-600 dark:text-red-300 text-sm">
                  {validationError}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!startDate || !endDate || !!validationError}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default RapRentalModal;
