"use client";

import { useState } from "react";
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

interface Size {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

interface SizeTableProps {
  sizes: Size[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

export default function SizeTable({
  sizes,
  onEdit,
  onDelete,
  onAdd,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: SizeTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSizes = sizes.filter(
    (size) =>
      size.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      size.min_chieu_cao.toString().includes(searchQuery) ||
      size.max_chieu_cao.toString().includes(searchQuery) ||
      size.min_can_nang.toString().includes(searchQuery) ||
      size.max_can_nang.toString().includes(searchQuery)
  );

  // Pagination logic
  const totalItems = filteredSizes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSizes = filteredSizes.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" id="size-title">
            Quản lý size
          </h1>
          <Button className="flex items-center gap-2" onClick={onAdd}>
            <PlusCircle className="h-4 w-4" />
            Thêm Size
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              id="search-input"
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
              <TableHead>ID</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Chiều cao (cm)</TableHead>
              <TableHead>Cân nặng (kg)</TableHead>
              <TableHead className="w-[200px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSizes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedSizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell>{size.id}</TableCell>
                  <TableCell>{size.size}</TableCell>
                  <TableCell>
                    {size.min_chieu_cao} - {size.max_chieu_cao}
                  </TableCell>
                  <TableCell>
                    {size.min_can_nang} - {size.max_can_nang}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onEdit(size.id)}
                        id={`edit-btn-${size.id}`}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(size.id)}
                        id={`delete-btn-${size.id}`}
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
