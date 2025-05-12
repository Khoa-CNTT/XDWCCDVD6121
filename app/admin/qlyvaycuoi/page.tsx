"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface VayCuoi {
  id: number;
  ten: string;
  gia: number;
  anh: string;
  size_id: number;
  created_at: string;
  updated_at: string;
}

interface KichThuoc {
  id: number;
  size: string;
}

const Page = () => {
  const [danhSachVayCuoi, setDanhSachVayCuoi] = useState<VayCuoi[]>([]);
  const [danhSachKichThuoc, setDanhSachKichThuoc] = useState<KichThuoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVayCuoi, setFilteredVayCuoi] = useState<VayCuoi[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    vayCuoi: VayCuoi | null;
  }>({
    isOpen: false,
    vayCuoi: null,
  });

  useEffect(() => {
    if (!danhSachVayCuoi.length) return;

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = danhSachVayCuoi.filter((vayCuoi) => {
      return (
        vayCuoi.id.toString().includes(searchTermLower) ||
        vayCuoi.ten.toLowerCase().includes(searchTermLower) ||
        vayCuoi.gia.toString().includes(searchTermLower) ||
        getKichThuocById(vayCuoi.size_id)
          .toLowerCase()
          .includes(searchTermLower)
      );
    });
    setFilteredVayCuoi(filtered);
  }, [searchTerm, danhSachVayCuoi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resVayCuoi, resKichThuoc] = await Promise.all([
          fetch("/api/vaycuoi"),
          fetch("/api/size"),
        ]);

        const [dataVayCuoi, dataKichThuoc] = await Promise.all([
          resVayCuoi.json(),
          resKichThuoc.json(),
        ]);
        console.log("Sample váy cưới:", dataVayCuoi.datas[0]);
        console.log("Sample kích thước:", dataKichThuoc.datas[0]);

        setDanhSachVayCuoi(dataVayCuoi.datas);
        setFilteredVayCuoi(dataVayCuoi.datas);
        setDanhSachKichThuoc(dataKichThuoc.datas);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getKichThuocById = (id: number) => {
    return (
      danhSachKichThuoc.find((kt) => kt.id === id)?.size || "Không xác định"
    );
  };

  const handleDelete = async (vayCuoi: VayCuoi) => {
    setDeleteDialog({ isOpen: true, vayCuoi });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.vayCuoi) return;

    try {
      const response = await fetch(`/api/vaycuoi/${deleteDialog.vayCuoi.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Lỗi khi xóa váy cưới");
      }

      setDanhSachVayCuoi((prev) =>
        prev.filter((item) => item.id !== deleteDialog.vayCuoi?.id)
      );
      toast.success("Xóa váy cưới thành công");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Có lỗi xảy ra khi xóa váy cưới");
    } finally {
      setDeleteDialog({ isOpen: false, vayCuoi: null });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý váy cưới</h1>
        <Link href="/admin/qlyvaycuoi/them">
          <Button
            id="btn-them-vay-cuoi"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm váy cưới mới
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            id="search-vay-cuoi"
            type="text"
            placeholder="Tìm kiếm theo ID, tên, giá, kích thước..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table
              id="table-vay-cuoi"
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hình ảnh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên váy cưới
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giá
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kích thước
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVayCuoi.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredVayCuoi.map((vayCuoi) => (
                    <tr
                      key={vayCuoi.id}
                      id={`vay-cuoi-${vayCuoi.id}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vayCuoi.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="h-20 w-20 relative cursor-pointer transition-transform hover:scale-105"
                          onClick={() =>
                            setSelectedImage({
                              url: vayCuoi.anh,
                              title: vayCuoi.ten,
                            })
                          }
                        >
                          <img
                            src={vayCuoi.anh}
                            alt={vayCuoi.ten}
                            className="h-full w-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vayCuoi.ten}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vayCuoi.gia.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getKichThuocById(vayCuoi.size_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/qlyvaycuoi/sua/${vayCuoi.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            id={`btn-sua-${vayCuoi.id}`}
                          >
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          id={`btn-xoa-${vayCuoi.id}`}
                          onClick={() => handleDelete(vayCuoi)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Dialog
            open={!!selectedImage}
            onOpenChange={() => setSelectedImage(null)}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedImage?.title}</DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-[600px] overflow-hidden">
                {selectedImage && (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={deleteDialog.isOpen}
            onOpenChange={(isOpen) =>
              !isOpen && setDeleteDialog({ isOpen: false, vayCuoi: null })
            }
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa váy cưới</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa váy cưới "
                  {deleteDialog.vayCuoi?.ten}" không? Hành động này không thể
                  hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setDeleteDialog({ isOpen: false, vayCuoi: null })
                  }
                >
                  Hủy
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Xác nhận xóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Page;
