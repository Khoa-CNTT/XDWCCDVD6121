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

interface PhongCach {
  id: string;
  ten_phong_cach: string;
  created_at: Date;
  updated_at: Date;
}

interface PhongCachTableProps {
  phongCachList: PhongCach[];
  isDeleting: string | null;
  onEdit: (item: PhongCach) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

const PhongCachTable = ({
  phongCachList,
  isDeleting,
  onEdit,
  onDelete,
  onAdd,
  searchTerm,
  onSearchChange,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PhongCachTableProps) => {
  // Filter the list based on search term
  const filteredList = phongCachList.filter((item) =>
    item.ten_phong_cach.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = filteredList.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" id="page-title">
            Quản lý phong cách makeup
          </h1>
          <Button className="flex items-center gap-2" onClick={onAdd}>
            <PlusCircle className="h-4 w-4" />
            Thêm Phong Cách
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              placeholder="Tìm kiếm theo tên phong cách..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
      </div>{" "}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tên phong cách</TableHead>
              <TableHead className="w-[180px]">Ngày tạo</TableHead>
              <TableHead className="w-[180px]">Ngày cập nhật</TableHead>
              <TableHead className="w-[150px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.ten_phong_cach}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {new Date(item.updated_at).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onEdit(item)}
                      id={`edit-btn-${item.id}`}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(item.id)}
                      disabled={isDeleting === item.id}
                      id={`delete-btn-${item.id}`}
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
};

export default PhongCachTable;
