"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
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

interface SoDayGhe {
  id: number;
  so_luong_day_ghe: number;
  created_at: string;
  updated_at: string;
}

interface SoDayGheTableProps {
  loading: boolean;
  data: SoDayGhe[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (item: SoDayGhe) => void;
  onDelete: (item: SoDayGhe) => void;
  onAdd: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

const SoDayGheTable = ({
  loading,
  data,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: SoDayGheTableProps) => {
  // Pagination logic
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" id="sodayghe-title">
            Quản lý số dãy ghế
          </h1>
          <Button className="flex items-center gap-2" onClick={onAdd}>
            <PlusCircle className="h-4 w-4" />
            Thêm Số Dãy Ghế
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              id="search-day-ghe"
              placeholder="Tìm kiếm theo ID, số lượng dãy ghế..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hiển thị:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={onPageSizeChange}
            >
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>SỐ LƯỢNG DÃY GHẾ</TableHead>
              <TableHead>NGÀY TẠO</TableHead>
              <TableHead>NGÀY CẬP NHẬT</TableHead>
              <TableHead className="w-[200px]">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.so_luong_day_ghe}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.updated_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onEdit(item)}
                        id={`edit-btn-${item.id}`}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(item)}
                        id={`delete-btn-${item.id}`}
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
};

export default SoDayGheTable;
