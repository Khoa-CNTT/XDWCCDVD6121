"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import SoGheTable from "./components/SoGheTable";
import DeleteDialog from "./components/DeleteDialog";
import FormDialog from "./components/FormDialog";

interface SoGhe {
  id: number;
  so_luong_ghe: number;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const [danhSachSoGhe, setDanhSachSoGhe] = useState<SoGhe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSoGhe, setFilteredSoGhe] = useState<SoGhe[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: SoGhe | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [formDialog, setFormDialog] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    value: string;
    isLoading: boolean;
    item: SoGhe | null;
  }>({
    isOpen: false,
    mode: "add",
    value: "",
    isLoading: false,
    item: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!danhSachSoGhe.length) return;

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = danhSachSoGhe.filter((item) => {
      return (
        item.id.toString().includes(searchTermLower) ||
        item.so_luong_ghe.toString().includes(searchTermLower)
      );
    });
    setFilteredSoGhe(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, danhSachSoGhe]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/soghe");
        const data = await response.json();

        setDanhSachSoGhe(data.datas);
        setFilteredSoGhe(data.datas);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleDelete = (item: SoGhe) => {
    setDeleteDialog({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.item) return;

    try {
      const response = await fetch(`/api/soghe/${deleteDialog.item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa số ghế");
      }
      setDanhSachSoGhe((prev) =>
        prev.filter((item) => item.id !== deleteDialog.item?.id)
      );
      setFilteredSoGhe((prev) =>
        prev.filter((item) => item.id !== deleteDialog.item?.id)
      );
      toast.success("Xóa số ghế thành công");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi xóa số ghế"
      );
    } finally {
      setDeleteDialog({ isOpen: false, item: null });
    }
  };

  const handleFormSubmit = async () => {
    try {
      setFormDialog((prev) => ({ ...prev, isLoading: true }));

      const value = Number(formDialog.value);
      if (isNaN(value) || value < 1) {
        throw new Error("Số ghế không hợp lệ");
      }

      const method = formDialog.mode === "add" ? "POST" : "PUT";
      const url =
        formDialog.mode === "add"
          ? "/api/soghe"
          : `/api/soghe/${formDialog.item?.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ so_luong_ghe: value }),
      });

      if (!response.ok) {
        throw new Error(
          formDialog.mode === "add"
            ? "Lỗi khi thêm số ghế"
            : "Lỗi khi cập nhật số ghế"
        );
      }

      const data = await response.json();
      const newItem = data.datas || data.data;

      if (formDialog.mode === "add") {
        setDanhSachSoGhe((prev) => [...prev, newItem]);
        setFilteredSoGhe((prev) => [...prev, newItem]);
        toast.success("Thêm số ghế thành công");
      } else {
        setDanhSachSoGhe((prev) =>
          prev.map((item) => (item.id === formDialog.item?.id ? newItem : item))
        );
        setFilteredSoGhe((prev) =>
          prev.map((item) => (item.id === formDialog.item?.id ? newItem : item))
        );
        toast.success("Cập nhật số ghế thành công");
      }

      setFormDialog({
        isOpen: false,
        mode: "add",
        value: "",
        isLoading: false,
        item: null,
      });
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(
        formDialog.mode === "add"
          ? "Có lỗi xảy ra khi thêm số ghế"
          : "Có lỗi xảy ra khi cập nhật số ghế"
      );
    } finally {
      setFormDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const openAddDialog = () => {
    setFormDialog({
      isOpen: true,
      mode: "add",
      value: "",
      isLoading: false,
      item: null,
    });
  };

  const openEditDialog = (item: SoGhe) => {
    setFormDialog({
      isOpen: true,
      mode: "edit",
      value: item.so_luong_ghe.toString(),
      isLoading: false,
      item,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <SoGheTable
        loading={loading}
        data={filteredSoGhe}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onAdd={openAddDialog}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen && setDeleteDialog({ isOpen: false, item: null })
        }
        item={deleteDialog.item}
        onConfirm={confirmDelete}
      />

      <FormDialog
        isOpen={formDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setFormDialog({
            isOpen: false,
            mode: "add",
            value: "",
            isLoading: false,
            item: null,
          })
        }
        value={formDialog.value}
        onChange={(value) => setFormDialog((prev) => ({ ...prev, value }))}
        onSubmit={handleFormSubmit}
        mode={formDialog.mode}
        isLoading={formDialog.isLoading}
      />
    </div>
  );
};

export default Page;
