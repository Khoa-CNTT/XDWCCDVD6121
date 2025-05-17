"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VayInstance {
  id: number;
  ten: string;
  vay_id: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "RESERVED";
}

interface OrderItem {
  id: number;
  donhang_id: number;

  // Thông tin váy cưới
  vay_id?: number | null;
  vay_instance_id?: number | null; // Thêm vay_instance_id
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

  created_at: string;
  updated_at: string;
}

interface DonHang {
  id: number;
  ma_don_hang: string;
  order_status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  payment_method: "PAYOS" | "COD";
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi: string;
  email: string;
  transaction_id: number;
  tong_tien: number;
  created_at: string;
  updated_at: string;
  transaction_id_relation: {
    so_tien: number;
    payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  };
  orderItems: OrderItem[];
}

interface OrderDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  donHang: DonHang | null;
}

const OrderDetailDialog = ({
  isOpen,
  onClose,
  donHang,
}: OrderDetailDialogProps) => {
  const [vayInstances, setVayInstances] = useState<Record<number, VayInstance>>(
    {}
  );
  const [loadingInstances, setLoadingInstances] = useState<boolean>(false);
  const [instanceErrors, setInstanceErrors] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    // Fetch váy instances khi đơn hàng được hiển thị
    if (donHang && isOpen) {
      const vayInstanceIds = donHang.orderItems
        .filter((item) => item.vay_instance_id)
        .map((item) => item.vay_instance_id as number);

      if (vayInstanceIds.length > 0) {
        setLoadingInstances(true);
        setInstanceErrors({});

        // Fetch each instance in parallel
        Promise.all(
          vayInstanceIds.map((id) =>
            fetch(`/api/vayinstance/${id}`)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Không thể tải thông tin váy instance ${id}`);
                }
                return res.json();
              })
              .catch((error) => {
                setInstanceErrors((prev) => ({ ...prev, [id]: true }));
                console.error(`Lỗi khi tải váy instance ${id}:`, error);
                return null;
              })
          )
        )
          .then((results) => {
            const instanceMap: Record<number, VayInstance> = {};
            results.forEach((instance) => {
              if (instance && instance.id) {
                instanceMap[instance.id] = instance;
              }
            });
            setVayInstances(instanceMap);
          })
          .finally(() => {
            setLoadingInstances(false);
          });
      }
    } else if (!isOpen) {
      // Reset state khi đóng dialog
      setVayInstances({});
      setLoadingInstances(false);
      setInstanceErrors({});
    }
  }, [donHang, isOpen]);

  if (!donHang) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getOrderStatusVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "outline";
      default:
        return "destructive";
    }
  };
  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "REFUNDED":
        return "outline";
      default:
        return "destructive";
    }
  };

  // Helper function để chuyển đổi trạng thái váy instance sang tiếng Việt
  const getVayStatusLabel = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Có sẵn";
      case "RENTED":
        return "Đang thuê";
      case "RESERVED":
        return "Đã đặt trước";
      case "MAINTENANCE":
        return "Đang bảo trì";
      default:
        return status;
    }
  };

  // Hàm để tải lại thông tin của một váy instance cụ thể
  const reloadVayInstance = (instanceId: number) => {
    setLoadingInstances(true);
    setInstanceErrors((prev) => ({ ...prev, [instanceId]: false }));

    fetch(`/api/vayinstance/${instanceId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Không thể tải thông tin váy instance ${instanceId}`);
        }
        return res.json();
      })
      .then((instance) => {
        setVayInstances((prev) => ({
          ...prev,
          [instanceId]: instance,
        }));
      })
      .catch((error) => {
        console.error(`Lỗi khi tải váy instance ${instanceId}:`, error);
        setInstanceErrors((prev) => ({ ...prev, [instanceId]: true }));
      })
      .finally(() => {
        setLoadingInstances(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {" "}
          <DialogTitle>Chi tiết đơn hàng #{donHang.id}</DialogTitle>
          <div className="text-sm text-muted-foreground mt-1">
            <span>Mã đơn hàng: </span>
            <span className="font-mono">{donHang.ma_don_hang}</span>
          </div>
        </DialogHeader>

        {/* Thông tin khách hàng */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Thông tin khách hàng</h3>
              <div className="space-y-2 mt-2">
                <p>Tên: {donHang.ten_khach_hang}</p>
                <p>SĐT: {donHang.so_dien_thoai}</p>
                <p>Email: {donHang.email}</p>
                <p>Địa chỉ: {donHang.dia_chi}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Thông tin đơn hàng</h3>{" "}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Trạng thái:
                  </span>
                  <Badge variant={getOrderStatusVariant(donHang.order_status)}>
                    {donHang.order_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Thanh toán:
                  </span>
                  <Badge
                    variant={getPaymentStatusVariant(
                      donHang.transaction_id_relation.payment_status
                    )}
                  >
                    {donHang.transaction_id_relation.payment_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Phương thức:
                  </span>
                  <span>{donHang.payment_method}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Tổng tiền:
                  </span>
                  <span>{formatCurrency(donHang.tong_tien)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Ngày tạo:
                  </span>
                  <span>{formatDate(donHang.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Cập nhật:
                  </span>
                  <span>{formatDate(donHang.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Chi tiết sản phẩm */}
          <div>
            <h3 className="font-semibold mb-4">Chi tiết sản phẩm</h3>
            <div className="space-y-6">
              {donHang.orderItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="font-medium text-muted-foreground mb-2">
                    Sản phẩm #{index + 1}
                  </div>{" "}
                  {/* Váy cưới */}
                  {item.vay_id && (
                    <div className="mb-4">
                      <h4 className="font-medium text-blue-600">
                        Thông tin váy cưới
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {(() => {
                          const vayInstance = item.vay_instance_id
                            ? vayInstances[item.vay_instance_id]
                            : null;
                          return (
                            <>
                              <div className="space-y-2">
                                <div>Tên váy: {item.vay_ten}</div>
                                {item.vay_instance_id && loadingInstances && (
                                  <div className="text-sm text-gray-500">
                                    Đang tải thông tin váy instance...
                                  </div>
                                )}
                                {item.vay_instance_id &&
                                  instanceErrors[item.vay_instance_id] && (
                                    <div className="flex items-center gap-2 text-sm text-red-500">
                                      <span>
                                        Không thể tải thông tin váy instance
                                      </span>
                                      <button
                                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          reloadVayInstance(
                                            item.vay_instance_id as number
                                          );
                                        }}
                                      >
                                        Tải lại
                                      </button>
                                    </div>
                                  )}
                                {item.vay_instance_id && vayInstance && (
                                  <div className="text-sm flex items-center gap-2">
                                    <span className="font-medium">
                                      {vayInstance.ten}
                                    </span>
                                    <Badge
                                      variant={
                                        vayInstance.status === "AVAILABLE"
                                          ? "default"
                                          : vayInstance.status === "RENTED"
                                            ? "destructive"
                                            : vayInstance.status === "RESERVED"
                                              ? "secondary"
                                              : "outline"
                                      }
                                    >
                                      {getVayStatusLabel(vayInstance.status)}
                                    </Badge>
                                  </div>
                                )}
                                {item.vay_instance_id &&
                                  instanceErrors[item.vay_instance_id] && (
                                    <div className="text-sm text-red-500">
                                      Lỗi tải thông tin váy instance
                                    </div>
                                  )}
                              </div>
                              <div>
                                Giá: {formatCurrency(item.vay_gia || 0)}
                              </div>
                              {item.vay_instance_id && (
                                <div>
                                  ID váy instance: {item.vay_instance_id}
                                </div>
                              )}
                              <div>Ngày mượn: {formatDate(item.ngay_muon)}</div>
                              <div>Ngày trả: {formatDate(item.ngay_tra)}</div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  {/* Rạp cưới */}
                  {item.rap_id && (
                    <div className="mb-4">
                      <h4 className="font-medium text-green-600">
                        Thông tin rạp cưới
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p>Tên rạp: {item.rap_ten}</p>
                        <p>Giá thuê: {formatCurrency(item.rap_gia || 0)}</p>
                        <p>Ngày tổ chức: {formatDate(item.ngay_to_chuc)}</p>
                      </div>
                    </div>
                  )}
                  {/* Makeup */}
                  {item.makeup_id && (
                    <div>
                      <h4 className="font-medium text-purple-600">
                        Thông tin trang điểm
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p>Gói makeup: {item.makeup_ten}</p>
                        <p>Giá: {formatCurrency(item.makeup_gia || 0)}</p>
                        <p>Ngày makeup: {formatDate(item.ngay_makeup)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trợ giúp về trạng thái váy */}
          {donHang.orderItems.some((item) => item.vay_instance_id) && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
              <h4 className="font-medium mb-2">Trạng thái váy:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Có sẵn</Badge>
                  <span>Váy có thể cho thuê</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Đang thuê</Badge>
                  <span>Váy đang được khách thuê</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Đã đặt trước</Badge>
                  <span>Váy đã được đặt trước</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Đang bảo trì</Badge>
                  <span>Váy đang được bảo trì</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
