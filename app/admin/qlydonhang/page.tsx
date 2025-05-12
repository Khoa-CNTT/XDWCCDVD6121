"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DonHang {
  id: number;
  order_status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  payment_method: "PAYOS" | "COD";
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi: string;
  email: string;
  transaction_id: number;
  created_at: string;
  updated_at: string;
  transaction_id_relation: {
    so_tien: number;
    payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  };
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchDonHang = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/donhang");
      const data = await response.json();
      setDonHangs(data.datas);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonHang();
  }, []);

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
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

    try {
      const response = await fetch(`/api/donhang/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xóa đơn hàng thành công");
        fetchDonHang();
      } else {
        toast.error("Lỗi khi xóa đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa đơn hàng");
    }
  };

  const filteredDonHangs = filterStatus === "ALL" 
    ? donHangs 
    : donHangs.filter(dh => dh.order_status === filterStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" id="page-title">Quản Lý Đơn Hàng</h1>
        <Select 
          value={filterStatus} 
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-[180px]" id="status-filter">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="PENDING">Đang chờ</SelectItem>
            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
            <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Trạng thái đơn hàng</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonHangs.map((donHang) => (
              <TableRow key={donHang.id}>
                <TableCell>{donHang.id}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link">{donHang.ten_khach_hang}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng #{donHang.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold">Tên khách hàng:</p>
                          <p>{donHang.ten_khach_hang}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Số điện thoại:</p>
                          <p>{donHang.so_dien_thoai}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Địa chỉ:</p>
                          <p>{donHang.dia_chi}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Email:</p>
                          <p>{donHang.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Ngày tạo:</p>
                          <p>{new Date(donHang.created_at).toLocaleString("vi-VN")}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{donHang.so_dien_thoai}</TableCell>
                <TableCell>
                  <Select
                    value={donHang.order_status}
                    onValueChange={(value) => handleUpdateStatus(donHang.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <Badge className={OrderStatusColors[donHang.order_status]}>
                          {donHang.order_status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Đang chờ</SelectItem>
                      <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                      <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{donHang.payment_method}</TableCell>
                <TableCell>
                  {donHang.transaction_id_relation && (
                    <Badge className={PaymentStatusColors[donHang.transaction_id_relation.payment_status]}>
                      {donHang.transaction_id_relation.payment_status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {donHang.transaction_id_relation && new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(donHang.transaction_id_relation.so_tien)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteOrder(donHang.id)}
                    id={`delete-btn-${donHang.id}`}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
