"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DoTuoiTable from "./components/DoTuoiTable";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";

interface DoTuoi {
  id: number;
  dotuoi: string;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const [danhSachDoTuoi, setDanhSachDoTuoi] = useState<DoTuoi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoTuoi, setFilteredDoTuoi] = useState<DoTuoi[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DoTuoi | null>(null);
  const [formValue, setFormValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!danhSachDoTuoi.length) return;

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = danhSachDoTuoi.filter((doTuoi) => {
      return (
        doTuoi.id.toString().includes(searchTermLower) ||
        doTuoi.dotuoi.toString().includes(searchTermLower)
      );
    });
    setFilteredDoTuoi(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, danhSachDoTuoi]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dotuoi");
      const data = await response.json();
      const formattedData = data.datas.map(
        (item: {
          id: number;
          dotuoi: number;
          created_at: string;
          updated_at: string;
        }) => ({
          ...item,
          dotuoi: item.dotuoi.toString(),
        })
      );
      setDanhSachDoTuoi(formattedData);
      setFilteredDoTuoi(formattedData);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formValue.trim() || isNaN(Number(formValue))) {
      toast.error("Vui lòng nhập độ tuổi hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/dotuoi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dotuoi: Number(formValue) }),
      });

      if (!response.ok) throw new Error("Lỗi khi thêm độ tuổi");

      toast.success("Thêm độ tuổi thành công");
      setIsAddDialogOpen(false);
      setFormValue("");
      fetchData();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi thêm độ tuổi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedItem || !formValue.trim() || isNaN(Number(formValue))) {
      toast.error("Vui lòng nhập độ tuổi hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dotuoi/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dotuoi: Number(formValue) }),
      });

      if (!response.ok) throw new Error("Lỗi khi cập nhật độ tuổi");
      toast.success("Cập nhật độ tuổi thành công");
      setIsEditDialogOpen(false);
      setFormValue("");
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi cập nhật độ tuổi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dotuoi/${selectedItem.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa độ tuổi");
      }
      toast.success("Xóa độ tuổi thành công");
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi xóa độ tuổi"
      );
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size, 10));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="container mx-auto py-10">
      <DoTuoiTable
        loading={loading}
        data={filteredDoTuoi}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={(item) => {
          setSelectedItem(item);
          setFormValue(item.dotuoi);
          setIsEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setSelectedItem(item);
          setIsDeleteDialogOpen(true);
        }}
        onAdd={() => setIsAddDialogOpen(true)}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <FormDialog
        mode="add"
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        value={formValue}
        onChange={setFormValue}
        onSubmit={handleAdd}
        isLoading={isSubmitting}
      />

      <FormDialog
        mode="edit"
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        value={formValue}
        onChange={setFormValue}
        onSubmit={handleEdit}
        isLoading={isSubmitting}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        item={selectedItem}
      />
    </div>
  );
};

export default Page;
