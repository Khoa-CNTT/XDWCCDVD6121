"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DonHangTable from "./components/DonHangTable";
import DeleteDialog from "./components/DeleteDialog";
import OrderDetailDialog from "./components/OrderDetailDialog";

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

const OrderStatusColors = {
  PENDING: "bg-yellow-500",
  PROCESSING: "bg-blue-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

const PaymentStatusColors = {
  PENDING: "bg-yellow-500",
  PAID: "bg-green-500",
  FAILED: "bg-red-500",
  REFUNDED: "bg-purple-500",
};

export default function QuanLyDonHang() {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchDonHang = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/donhang");
      const data = await response.json();
      setDonHangs(data.datas);
      setCurrentPage(1);
    } catch {
      toast.error("Lỗi khi tải dữ liệu đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonHang();
  }, []);

  const handleUpdatePaymentStatus = async (
    transactionId: number,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/transaction/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: newStatus }),
      });

      if (response.ok) {
        toast.success("Đã cập nhật trạng thái thanh toán");
        fetchDonHang(); // Tải lại danh sách đơn hàng
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Không thể cập nhật trạng thái thanh toán"
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái thanh toán");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const donHang = donHangs.find((dh) => dh.id === id);
      if (!donHang) return;

      const response = await fetch(`/api/donhang/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...donHang,
          order_status: newStatus,
        }),
      });

      if (response.ok) {
        toast.success("Cập nhật trạng thái thành công");
        fetchDonHang();
      } else {
        toast.error("Lỗi khi cập nhật trạng thái");
      }
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = (id: number) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`/api/donhang/${orderToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xóa đơn hàng thành công");
        setDeleteDialogOpen(false);
        fetchDonHang();
      } else {
        toast.error("Lỗi khi xóa đơn hàng");
      }
    } catch {
      toast.error("Lỗi khi xóa đơn hàng");
    }
  };

  const handleShowDetail = (donHang: DonHang) => {
    setSelectedOrder(donHang);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size, 10));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-5">
      <DonHangTable
        donHangs={donHangs}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        OrderStatusColors={OrderStatusColors}
        PaymentStatusColors={PaymentStatusColors}
        onDelete={handleDelete}
        onStatusChange={handleUpdateStatus}
        onPaymentStatusChange={handleUpdatePaymentStatus}
        onFilterChange={setFilterStatus}
        onSearchChange={setSearchTerm}
        onShowDetail={handleShowDetail}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <OrderDetailDialog
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        donHang={selectedOrder}
      />
    </div>
  );
}
