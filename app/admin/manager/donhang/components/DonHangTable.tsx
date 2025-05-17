"use client";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

interface DonHangTableProps {
  donHangs: DonHang[];
  filterStatus: string;
  searchTerm: string;
  OrderStatusColors: Record<string, string>;
  PaymentStatusColors: Record<string, string>;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onPaymentStatusChange: (transactionId: number, status: string) => void; // Thêm prop mới
  onFilterChange: (status: string) => void;
  onSearchChange: (term: string) => void;
  onShowDetail: (donHang: DonHang) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

const DonHangTable = ({
  donHangs,
  filterStatus,
  searchTerm,
  OrderStatusColors,
  PaymentStatusColors,
  onDelete,
  onStatusChange,
  onPaymentStatusChange,
  onFilterChange,
  onSearchChange,
  onShowDetail,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DonHangTableProps) => {
  // Filter by status and search term
  const filteredDonHangs = donHangs
    .filter((dh) => filterStatus === "ALL" || dh.order_status === filterStatus)
    .filter((dh) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        dh.id.toString().includes(searchLower) ||
        dh.ma_don_hang.toLowerCase().includes(searchLower) ||
        dh.ten_khach_hang.toLowerCase().includes(searchLower) ||
        dh.so_dien_thoai.includes(searchLower) ||
        dh.dia_chi.toLowerCase().includes(searchLower) ||
        dh.email.toLowerCase().includes(searchLower) ||
        dh.order_status.toLowerCase().includes(searchLower) ||
        dh.payment_method.toLowerCase().includes(searchLower)
      );
    });

  // Pagination logic
  const totalItems = filteredDonHangs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDonHangs = filteredDonHangs.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" id="page-title">
          Quản Lý Đơn Hàng
        </h1>
        <Select value={filterStatus} onValueChange={onFilterChange}>
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            className="pl-10"
            placeholder="Tìm kiếm theo mã đơn hàng, ID, tên khách hàng, số điện thoại..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Hiển thị:</span>
          <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Mã đơn hàng</TableHead>
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
            {paginatedDonHangs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedDonHangs.map((donHang) => (
                <TableRow key={donHang.id}>
                  <TableCell>{donHang.id}</TableCell>
                  <TableCell>
                    <span className="font-mono">{donHang.ma_don_hang}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => onShowDetail(donHang)}
                    >
                      {donHang.ten_khach_hang}
                    </Button>
                  </TableCell>
                  <TableCell>{donHang.so_dien_thoai}</TableCell>
                  <TableCell>
                    <Select
                      value={donHang.order_status}
                      onValueChange={(value) =>
                        onStatusChange(donHang.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <Badge
                            className={OrderStatusColors[donHang.order_status]}
                          >
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
                    {donHang.payment_method === "COD" ? (
                      <Select
                        value={
                          donHang.transaction_id_relation?.payment_status ||
                          "PENDING"
                        }
                        onValueChange={(value) =>
                          onPaymentStatusChange(donHang.transaction_id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            <Badge
                              className={
                                donHang.transaction_id_relation
                                  ? PaymentStatusColors[
                                      donHang.transaction_id_relation
                                        .payment_status
                                    ]
                                  : "bg-gray-500"
                              }
                            >
                              {donHang.transaction_id_relation
                                ?.payment_status || "PENDING"}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">
                            Chưa thanh toán
                          </SelectItem>
                          <SelectItem value="PAID">Đã thanh toán</SelectItem>
                          <SelectItem value="FAILED">
                            Thanh toán thất bại
                          </SelectItem>
                          <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={
                          donHang.transaction_id_relation
                            ? PaymentStatusColors[
                                donHang.transaction_id_relation.payment_status
                              ]
                            : "bg-gray-500"
                        }
                        id={`payment-status-${donHang.id}`}
                      >
                        {(() => {
                          const status =
                            donHang.transaction_id_relation?.payment_status ||
                            "PENDING";
                          switch (status) {
                            case "PENDING":
                              return "Chưa thanh toán";
                            case "PAID":
                              return "Đã thanh toán";
                            case "FAILED":
                              return "Thanh toán thất bại";
                            case "REFUNDED":
                              return "Đã hoàn tiền";
                            default:
                              return status;
                          }
                        })()}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell id={`amount-${donHang.id}`}>
                    {donHang.transaction_id_relation
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(donHang.transaction_id_relation.so_tien)
                      : "0 ₫"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(donHang.id)}
                      id={`delete-btn-${donHang.id}`}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Trang {currentPage} trên {totalPages}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant={number === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonHangTable;
