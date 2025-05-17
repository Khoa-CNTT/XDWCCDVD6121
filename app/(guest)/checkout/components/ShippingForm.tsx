"use client";

import { ShippingInfo } from "../types";

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  onShippingInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ShippingForm({
  shippingInfo,
  onShippingInfoChange,
}: ShippingFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Thông tin giao hàng
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Họ
          </label>
          <input
            type="text"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={onShippingInfoChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500
                     dark:focus:border-pink-400 dark:focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tên
          </label>
          <input
            type="text"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={onShippingInfoChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500
                     dark:focus:border-pink-400 dark:focus:ring-pink-400"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={shippingInfo.email}
            onChange={onShippingInfoChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500
                     dark:focus:border-pink-400 dark:focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={onShippingInfoChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500
                     dark:focus:border-pink-400 dark:focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={onShippingInfoChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500
                     dark:focus:border-pink-400 dark:focus:ring-pink-400"
          />
        </div>
      </div>
    </div>
  );
}
