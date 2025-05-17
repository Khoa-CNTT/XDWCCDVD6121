"use client";

import { useState } from "react";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface OrderItem {
  id: number;
  donhang_id: number;
  // Thông tin váy cưới
  vay_id?: number | null;
  vay_ten?: string | null;
  vay_gia?: number | null;
  vay_size?: string | null;
  vay_mau?: string | null;
  ngay_muon?: string | null;
  ngay_tra?: string | null;
  // Thông tin rạp cưới
  rap_id?: number | null;
  rap_ten?: string | null;
  rap_gia?: number | null;
  ngay_to_chuc?: string | null;
  // Thông tin makeup
  makeup_id?: number | null;
  makeup_ten?: string | null;
  makeup_gia?: number | null;
  ngay_makeup?: string | null;
}

interface OrderDetails {
  ma_don_hang: string;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  tong_tien: number;
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi: string;
  email: string;
  transaction_id_relation?: {
    payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  };
  orderItems: OrderItem[];
}

const ORDER_STATUS_MAP = {
  PENDING: "Đang chờ",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const PAYMENT_METHOD_MAP = {
  PAYOS: "Thanh toán online",
  COD: "Thanh toán khi nhận hàng",
};

const PAYMENT_STATUS_MAP = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  REFUNDED: "Đã hoàn tiền",
};

export default function SearchOrder() {
  const [orderCode, setOrderCode] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOrderSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrderDetails(null);

    try {
      const response = await fetch(`/api/search-order?code=${orderCode}`);
      const data = await response.json();

      if (response.ok) {
        setOrderDetails(data.data);
      } else {
        setError(data.error || "Không tìm thấy đơn hàng");
      }
    } catch (_err) {
      setError("Đã có lỗi xảy ra khi tìm kiếm đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tra Cứu Đơn Hàng
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Nhập mã đơn hàng của bạn để kiểm tra thông tin và trạng thái đơn
              hàng
            </p>
          </div>

          <form onSubmit={handleOrderSearch} className="space-y-4">
            <div>
              <label
                htmlFor="orderCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mã đơn hàng
              </label>{" "}
              <input
                type="text"
                id="orderCode"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="Ví dụ: HD20250515-ABC123"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Mã đơn hàng được cung cấp khi bạn hoàn tất đặt hàng
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>

          {orderDetails && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Thông tin đơn hàng
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mã đơn hàng
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {orderDetails.ma_don_hang}
                    </p>
                  </div>
                  <div>
                    {" "}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trạng thái đơn hàng
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {ORDER_STATUS_MAP[orderDetails.order_status]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trạng thái thanh toán
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {orderDetails.transaction_id_relation
                        ? PAYMENT_STATUS_MAP[
                            orderDetails.transaction_id_relation.payment_status
                          ]
                        : "Chưa thanh toán"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phương thức thanh toán
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {PAYMENT_METHOD_MAP[orderDetails.payment_method]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tổng tiền
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(orderDetails.tong_tien)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Thông tin khách hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Họ và tên
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {orderDetails.ten_khach_hang}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Số điện thoại
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {orderDetails.so_dien_thoai}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {orderDetails.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Địa chỉ
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {orderDetails.dia_chi}
                      </p>{" "}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Chi tiết sản phẩm
                  </h3>
                  <div className="space-y-6">
                    {orderDetails.orderItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Sản phẩm #{index + 1}
                        </div>

                        {/* Váy cưới */}
                        {item.vay_id && (
                          <div className="mb-4">
                            <h4 className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                              Thông tin váy cưới
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Tên váy
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.vay_ten}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Giá
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.vay_gia || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Size
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.vay_size}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Màu sắc
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.vay_mau}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Ngày mượn
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.ngay_muon
                                    ? new Date(
                                        item.ngay_muon
                                      ).toLocaleDateString("vi-VN")
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Ngày trả
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.ngay_tra
                                    ? new Date(
                                        item.ngay_tra
                                      ).toLocaleDateString("vi-VN")
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rạp cưới */}
                        {item.rap_id && (
                          <div className="mb-4">
                            <h4 className="text-green-600 dark:text-green-400 font-medium mb-2">
                              Thông tin rạp cưới
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Tên rạp
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.rap_ten}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Giá thuê
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.rap_gia || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Ngày tổ chức
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.ngay_to_chuc
                                    ? new Date(
                                        item.ngay_to_chuc
                                      ).toLocaleDateString("vi-VN")
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Makeup */}
                        {item.makeup_id && (
                          <div>
                            <h4 className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                              Thông tin trang điểm
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Gói makeup
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.makeup_ten}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Giá
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.makeup_gia || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Ngày makeup
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.ngay_makeup
                                    ? new Date(
                                        item.ngay_makeup
                                      ).toLocaleDateString("vi-VN")
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
