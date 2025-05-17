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
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Mau {
  id: number;
  ten_mau: string;
}

interface SoGhe {
  id: number;
  so_luong_ghe: number;
}

interface SoDayGhe {
  id: number;
  so_luong_day_ghe: number;
}

interface RapCuoi {
  id: number;
  ten_rap: string;
  mau_id: number;
  so_ghe_id: number;
  so_day_ghe_id: number;
  gia_thue: number;
  anh_rap: string;
}

interface RapCuoiTableProps {
  rapCuois: RapCuoi[];
  mauList: Mau[];
  soGheList: SoGhe[];
  soDayGheList: SoDayGhe[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (rapCuoi: RapCuoi) => void;
  onDelete: (id: number) => void;
  onImageClick: (url: string, title: string) => void;
  onAddNew: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

const RapCuoiTable = ({
  rapCuois,
  mauList,
  soGheList,
  soDayGheList,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onImageClick,
  onAddNew,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: RapCuoiTableProps) => {
  // Hàm lọc danh sách theo từ khóa
  const filteredRapCuois = rapCuois.filter((rapCuoi) => {
    const idStr = rapCuoi.id.toString();
    const tenRap = rapCuoi.ten_rap.toLowerCase();
    const giaThue = rapCuoi.gia_thue.toString();
    const tenMau =
      mauList.find((m) => m.id === rapCuoi.mau_id)?.ten_mau?.toLowerCase() ||
      "";
    const soGhe =
      soGheList
        .find((g) => g.id === rapCuoi.so_ghe_id)
        ?.so_luong_ghe?.toString() || "";
    const soDayGhe =
      soDayGheList
        .find((d) => d.id === rapCuoi.so_day_ghe_id)
        ?.so_luong_day_ghe?.toString() || "";
    const search = searchTerm.toLowerCase();
    return (
      idStr.includes(search) ||
      tenRap.includes(search) ||
      giaThue.includes(search) ||
      tenMau.includes(search) ||
      soGhe.includes(search) ||
      soDayGhe.includes(search)
    );
  });

  // Pagination logic
  const totalItems = filteredRapCuois.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRapCuois = filteredRapCuois.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 id="page-title" className="text-2xl font-bold">
          Quản Lý Rạp Cưới
        </h1>
        <Button className="flex items-center gap-2" onClick={onAddNew}>
          <PlusCircle className="h-4 w-4" />
          Thêm Rạp Cưới
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            id="search-input"
            placeholder="Tìm kiếm theo tên, màu sắc, số ghế..."
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên rạp</TableHead>
              <TableHead>Màu sắc</TableHead>
              <TableHead>Số ghế</TableHead>
              <TableHead>Số dãy ghế</TableHead>
              <TableHead>Giá thuê</TableHead>
              <TableHead className="w-[200px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRapCuois.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-6"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedRapCuois.map((rapCuoi) => (
                <TableRow key={rapCuoi.id}>
                  <TableCell>{rapCuoi.id}</TableCell>
                  <TableCell>
                    <div
                      className="relative w-16 h-16 cursor-pointer"
                      onClick={() =>
                        onImageClick(rapCuoi.anh_rap, rapCuoi.ten_rap)
                      }
                    >
                      <Image
                        src={rapCuoi.anh_rap}
                        alt={rapCuoi.ten_rap}
                        className="object-cover rounded-md"
                        fill
                        sizes="64px"
                        quality={80}
                        loading="lazy"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{rapCuoi.ten_rap}</TableCell>
                  <TableCell>
                    {mauList.find((m) => m.id === rapCuoi.mau_id)?.ten_mau}
                  </TableCell>
                  <TableCell>
                    {
                      soGheList.find((g) => g.id === rapCuoi.so_ghe_id)
                        ?.so_luong_ghe
                    }
                  </TableCell>
                  <TableCell>
                    {
                      soDayGheList.find((d) => d.id === rapCuoi.so_day_ghe_id)
                        ?.so_luong_day_ghe
                    }
                  </TableCell>
                  <TableCell>
                    {rapCuoi.gia_thue.toLocaleString("vi-VN")}đ/ngày
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onEdit(rapCuoi)}
                        id={`edit-btn-${rapCuoi.id}`}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(rapCuoi.id)}
                        id={`delete-btn-${rapCuoi.id}`}
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
};

export default RapCuoiTable;
