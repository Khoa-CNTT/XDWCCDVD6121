"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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

interface Makeup {
  id: number;
  ten_makeup: string;
  gia_makeup: number;
  phong_cach_id: number;
  anh_makeup: string;
  chi_tiet: string;
  phong_cach_relation?: {
    ten_phong_cach: string;
  };
}

interface MakeupTableProps {
  loading: boolean;
  makeupList: Makeup[];
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (item: Makeup) => void;
  onDelete: (item: Makeup) => void;
  onImageClick: (url: string, title: string) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function MakeupTable({
  loading,
  makeupList,
  search,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  onImageClick,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: MakeupTableProps) {
  const [expandedDetails, setExpandedDetails] = useState<number[]>([]);

  const toggleDetailExpansion = (id: number) => {
    setExpandedDetails((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isDetailExpanded = (id: number) => expandedDetails.includes(id);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const filteredMakeup = makeupList.filter((m) => {
    const s = search.toLowerCase();
    return (
      m.id.toString().includes(s) ||
      m.ten_makeup.toLowerCase().includes(s) ||
      m.gia_makeup.toString().includes(s) ||
      (m.phong_cach_relation?.ten_phong_cach?.toLowerCase() || "").includes(
        s
      ) ||
      (m.chi_tiet || "").toLowerCase().includes(s)
    );
  });

  // Pagination logic
  const totalItems = filteredMakeup.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredMakeup.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" id="makeup-title">
          Quản lý dịch vụ Makeup
        </h1>
        <Button className="flex items-center gap-2" onClick={onAdd}>
          <PlusCircle className="h-4 w-4" />
          Thêm dịch vụ Makeup
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            id="search-makeup-input"
            type="text"
            placeholder="Tìm kiếm theo ID, tên, giá, phong cách..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
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
        <Table id="makeup-table">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ẢNH</TableHead>
              <TableHead>TÊN DỊCH VỤ</TableHead>
              <TableHead>PHONG CÁCH</TableHead>
              <TableHead>GIÁ DỊCH VỤ</TableHead>
              <TableHead>CHI TIẾT</TableHead>
              <TableHead className="w-[200px]">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-6"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((makeup) => (
                <TableRow key={makeup.id}>
                  <TableCell>{makeup.id}</TableCell>
                  <TableCell>
                    <div
                      className="relative w-16 h-16 cursor-pointer"
                      onClick={() =>
                        onImageClick(makeup.anh_makeup, makeup.ten_makeup)
                      }
                    >
                      <Image
                        src={makeup.anh_makeup}
                        alt={makeup.ten_makeup}
                        className="object-cover rounded-md"
                        fill
                        sizes="64px"
                        quality={80}
                        loading="lazy"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{makeup.ten_makeup}</TableCell>
                  <TableCell>
                    {makeup.phong_cach_relation?.ten_phong_cach}
                  </TableCell>
                  <TableCell>{formatPrice(makeup.gia_makeup)}</TableCell>
                  <TableCell className="max-w-[300px]">
                    {makeup.chi_tiet && (
                      <div>
                        <div className="text-sm text-gray-700 whitespace-normal">
                          {isDetailExpanded(makeup.id)
                            ? makeup.chi_tiet
                            : truncateText(makeup.chi_tiet)}
                        </div>
                        {makeup.chi_tiet.length > 50 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-1 h-6 p-0 text-blue-600"
                            onClick={() => toggleDetailExpansion(makeup.id)}
                          >
                            {isDetailExpanded(makeup.id) ? (
                              <span className="flex items-center">
                                Thu gọn <ChevronUp className="h-4 w-4 ml-1" />
                              </span>
                            ) : (
                              <span className="flex items-center">
                                Xem thêm{" "}
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </span>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                    {!makeup.chi_tiet && (
                      <span className="text-sm text-gray-500">
                        Không có chi tiết
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onEdit(makeup)}
                        id={`edit-btn-${makeup.id}`}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(makeup)}
                        id={`delete-btn-${makeup.id}`}
                      >
                        Xóa
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
      {totalPages > 1 && !loading && (
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
