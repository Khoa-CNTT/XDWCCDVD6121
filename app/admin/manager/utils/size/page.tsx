"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import SizeTable from "./components/SizeTable";
import { FormDialog } from "./components/FormDialog";
import DeleteSizeDialog from "./components/DeleteSizeDialog";

interface Size {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

export default function SizePage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [sizeToDelete, setSizeToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchSizes = async () => {
    try {
      const response = await fetch("/api/size");
      const data = await response.json();
      setSizes(data.datas);
      setCurrentPage(1); // Reset to page 1 when data changes
    } catch {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleOpenAddForm = () => {
    setFormMode("add");
    setEditingSize(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    const sizeToEdit = sizes.find((size) => size.id === id);
    if (sizeToEdit) {
      setFormMode("edit");
      setEditingSize(sizeToEdit);
      setFormDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setSizeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sizeToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/size/${sizeToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa size");
      }
      toast.success("Xóa size thành công");
      await fetchSizes();
      setIsDeleteDialogOpen(false);
      setSizeToDelete(null);
    } catch (error) {
      console.error("Error deleting size:", error);
      toast.error(error instanceof Error ? error.message : "Lỗi khi xóa size");
    } finally {
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
      setSizeToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size, 10));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) return null;

  return (
    <div className="container mx-auto py-10">
      <SizeTable
        sizes={sizes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleOpenAddForm}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <FormDialog
        isOpen={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        mode={formMode}
        editingSize={editingSize}
        onSuccess={fetchSizes}
      />

      <DeleteSizeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        sizeId={sizeToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
