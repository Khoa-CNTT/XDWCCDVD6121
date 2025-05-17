"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import PhongCachTable from "./components/PhongCachTable";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";

interface PhongCach {
  id: string;
  ten_phong_cach: string;
  created_at: Date;
  updated_at: Date;
}

export default function PhongCachPage() {
  const [phongCachList, setPhongCachList] = useState<PhongCach[]>([]);
  const [formValue, setFormValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingPhongCach, setEditingPhongCach] = useState<PhongCach | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: PhongCach | null;
  }>({
    isOpen: false,
    item: null,
  });

  const fetchPhongCach = async () => {
    try {
      const response = await fetch("/api/phongcach");
      const data = await response.json();
      setPhongCachList(data.datas);
      setCurrentPage(1); // Reset to first page when data changes
    } catch {
      toast.error("Không thể tải danh sách phong cách");
    }
  };

  useEffect(() => {
    fetchPhongCach();
  }, []);
  const handleFormSubmit = async () => {
    if (!formValue.trim()) {
      toast.error("Vui lòng nhập tên phong cách");
      return;
    }

    setIsSubmitting(true);
    try {
      const method = formMode === "add" ? "POST" : "PUT";
      const url =
        formMode === "add"
          ? "/api/phongcach"
          : `/api/phongcach/${editingPhongCach?.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_phong_cach: formValue,
        }),
      });

      if (response.ok) {
        toast.success(
          formMode === "add"
            ? "Thêm phong cách thành công"
            : "Cập nhật thành công"
        );
        setFormValue("");
        setFormDialogOpen(false);
        setEditingPhongCach(null);
        fetchPhongCach();
      } else {
        toast.error(
          formMode === "add"
            ? "Không thể thêm phong cách"
            : "Không thể cập nhật phong cách"
        );
      }
    } catch {
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhongCach = async (id: string) => {
    const item = phongCachList.find((item) => item.id === id);
    if (item) {
      setDeleteDialog({ isOpen: true, item });
    }
  };

  const confirmDelete = async () => {
    const id = deleteDialog.item?.id;
    if (!id) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/phongcach/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa phong cách");
      }
      toast.success("Xóa phong cách thành công");
      fetchPhongCach();
      setDeleteDialog({ isOpen: false, item: null });
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi xóa phong cách"
      );
    } finally {
      setIsDeleting(null);
      setDeleteDialog({ isOpen: false, item: null });
    }
  };

  const handleOpenAddDialog = () => {
    setFormMode("add");
    setFormValue("");
    setFormDialogOpen(true);
  };

  const handleEditPhongCach = (item: PhongCach) => {
    setFormMode("edit");
    setEditingPhongCach(item);
    setFormValue(item.ten_phong_cach);
    setFormDialogOpen(true);
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
      <PhongCachTable
        phongCachList={phongCachList}
        isDeleting={isDeleting}
        onEdit={handleEditPhongCach}
        onDelete={handleDeletePhongCach}
        onAdd={handleOpenAddDialog}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <FormDialog
        isOpen={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        mode={formMode}
        value={formValue}
        onChange={setFormValue}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ isOpen: false, item: null })
        }
        onConfirm={confirmDelete}
        item={deleteDialog.item}
      />
    </div>
  );
}
