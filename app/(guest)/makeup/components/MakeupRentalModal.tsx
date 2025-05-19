"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/components/css/datepicker.css";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { toast } from "sonner";

interface MakeupInfo {
  ten_makeup: string;
  anh_makeup: string;
  gia_makeup: number;
  phong_cach?: string;
  chi_tiet?: string;
}

interface MakeupRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentDate: Date) => void;
  makeupInfo?: MakeupInfo;
}

const MakeupRentalModal: React.FC<MakeupRentalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  makeupInfo,
}) => {
  const [appointmentDate, setAppointmentDate] = React.useState<Date | null>(
    null
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(false);
  const handleSubmit = () => {
    if (!appointmentDate) return;

    const validationError = getDateValidationError(appointmentDate);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    onSubmit(appointmentDate);
    onClose();
  };

  // Reset date when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setAppointmentDate(null);
      setIsDetailsExpanded(false);
    }
  }, [isOpen]);

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const today = new Date();
  today.setDate(today.getDate() + 1); // Set minimum date to tomorrow
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months in advance

  // Validation functions
  const isValidAppointmentDate = (date: Date | null) => {
    if (!date) return false;

    // Kiểm tra xem ngày có phải là cuối tuần không
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      // Chủ nhật
      return false;
    }

    // Kiểm tra xem giờ đặt lịch có hợp lệ không (chỉ cho phép đặt trước 1 ngày)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return date >= tomorrow;
  };

  const getDateValidationError = (date: Date | null) => {
    if (!date) {
      return "Vui lòng chọn ngày hẹn";
    }

    // const dayOfWeek = date.getDay();
    // if (dayOfWeek === 0) {
    //   return "Không nhận đặt lịch vào Chủ nhật";
    // }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (date < tomorrow) {
      return "Vui lòng đặt lịch trước ít nhất 1 ngày";
    }

    return null;
  };

  const validationError = getDateValidationError(appointmentDate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="relative bg-white dark:bg-gray-800 w-full max-w-xl mx-auto rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-medium dark:text-white">
            Đặt Lịch Trang Điểm
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 dark:text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Makeup info section */}
          {makeupInfo && (
            <div className="mb-6 flex flex-col md:flex-row gap-6">
              {/* Makeup image */}
              <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={makeupInfo.anh_makeup}
                  alt={makeupInfo.ten_makeup}
                  width={300}
                  height={400}
                  quality={80}
                  className="object-cover w-full h-full"
                  priority={true}
                />
              </div>
              {/* Makeup details */}
              <div className="w-full md:w-1/2 space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {makeupInfo.ten_makeup}
                </h3>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {makeupInfo.gia_makeup.toLocaleString("vi-VN")}đ
                </p>
                {makeupInfo.phong_cach && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Phong cách: {makeupInfo.phong_cach}
                  </p>
                )}
                {makeupInfo.chi_tiet && (
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Chi tiết:</p>
                    <p className="mt-1">
                      {isDetailsExpanded
                        ? makeupInfo.chi_tiet
                        : truncateText(makeupInfo.chi_tiet, 100)}
                    </p>
                    {makeupInfo.chi_tiet.length > 100 && (
                      <button
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="mt-1 text-pink-500 hover:text-pink-600 text-sm font-medium flex items-center"
                      >
                        {isDetailsExpanded ? (
                          <>
                            Ẩn bớt <ChevronUpIcon className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Xem thêm{" "}
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date picker section */}
          <div className="space-y-6">
            {/* Date selection */}
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Ngày Hẹn
              </div>
              <DatePicker
                selected={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                dateFormat="dd/MM/yyyy"
                minDate={today}
                maxDate={maxDate}
                locale={vi}
                placeholderText="Chọn ngày hẹn"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-blue-600 dark:text-blue-300 text-sm">
                <div className="font-medium mb-2">Lưu ý:</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Vui lòng đặt lịch trước ít nhất 1 ngày</li>
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
            disabled={!isValidAppointmentDate(appointmentDate)}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeupRentalModal;
