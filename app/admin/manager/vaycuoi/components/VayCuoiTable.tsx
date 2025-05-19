"use client";

import Image from "next/image";
import {
  Eye,
  Pencil,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { numberFormat } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface VayInstance {
  id: number;
  vay_id: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  rental_start: string | null;
  rental_end: string | null;
}

interface VayCuoi {
  id: number;
  ten: string;
  gia: number;
  anh: string;
  mau_id: number;
  size_id: number;
  do_tuoi_id: number;
  chi_tiet: string;
  instances: VayInstance[];
  mau_release: { ten_mau: string };
  size_relation: { size: string };
  do_tuoi_relation: { dotuoi: number };
}

interface VayCuoiTableProps {
  data: VayCuoi[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onView: (vaycuoi: VayCuoi) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: string) => void;
  onImageClick?: (image: { url: string; title: string }) => void;
}

export function VayCuoiTable({
  data,
  searchTerm,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onImageClick,
}: VayCuoiTableProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [expandedDetails, setExpandedDetails] = useState<number[]>([]);
  const toggleDetails = (id: number) => {
    setExpandedDetails((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            placeholder="Tìm kiếm theo tên váy, màu, size..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
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
      </div>{" "}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[100px]">Hình ảnh</TableHead>
              <TableHead>Tên váy cưới</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Kích thước</TableHead>
              <TableHead>Màu sắc</TableHead>
              <TableHead className="w-[100px]">Số lượng</TableHead>
              <TableHead>Chi tiết</TableHead>
              <TableHead className="text-right w-[150px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((vaycuoi) => (
                <TableRow key={vaycuoi.id}>
                  <TableCell>{vaycuoi.id}</TableCell>
                  <TableCell>
                    <div
                      className="relative h-16 w-16 rounded-md overflow-hidden cursor-pointer"
                      onClick={() =>
                        onImageClick?.({ url: vaycuoi.anh, title: vaycuoi.ten })
                      }
                    >
                      <Image
                        src={vaycuoi.anh}
                        alt={vaycuoi.ten}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{vaycuoi.ten}</TableCell>
                  <TableCell>{numberFormat(vaycuoi.gia)}</TableCell>
                  <TableCell>{vaycuoi.size_relation.size}</TableCell>
                  <TableCell>{vaycuoi.mau_release.ten_mau}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {vaycuoi.instances?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm">
                      <div
                        className={
                          expandedDetails.includes(vaycuoi.id)
                            ? ""
                            : "line-clamp-1"
                        }
                      >
                        {vaycuoi.chi_tiet || "Chưa có thông tin chi tiết"}
                      </div>
                      {vaycuoi.chi_tiet && vaycuoi.chi_tiet.length > 60 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 text-blue-600"
                          onClick={() => toggleDetails(vaycuoi.id)}
                        >
                          {expandedDetails.includes(vaycuoi.id) ? (
                            <span className="flex items-center gap-1">
                              Ẩn bớt <ChevronUp className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              Xem thêm <ChevronDown className="h-3 w-3" />
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(vaycuoi)}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(vaycuoi.id)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(vaycuoi.id)}
                        className="hover:text-red-500"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
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
}
