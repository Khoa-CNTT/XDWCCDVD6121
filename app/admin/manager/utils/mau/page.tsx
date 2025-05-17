"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import MauTable from "./components/MauTable";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";

interface Mau {
  id: number;
  ten_mau: string;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const [danhSachMau, setDanhSachMau] = useState<Mau[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMau, setFilteredMau] = useState<Mau[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    mau: Mau | null;
  }>({
    isOpen: false,
    mau: null,
  });

  // Form states
  const [newMau, setNewMau] = useState("");
  const [editingMau, setEditingMau] = useState<Mau | null>(null);

  useEffect(() => {
    if (!danhSachMau.length) return;

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = danhSachMau.filter((mau) => {
      return (
        mau.id.toString().includes(searchTermLower) ||
        mau.ten_mau.toLowerCase().includes(searchTermLower)
      );
    });
    setFilteredMau(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, danhSachMau]);

  const fetchDanhSachMau = async () => {
    try {
      const response = await fetch("/api/mau");
      const data = await response.json();

      if (response.ok) {
        setDanhSachMau(data.datas);
        setFilteredMau(data.datas);
        setCurrentPage(1); // Reset to first page when data changes
      } else {
        toast.error("Lỗi khi tải danh sách màu");
      }
    } catch {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSachMau();
  }, []);

  const handleAdd = () => {
    setNewMau("");
    setShowAddDialog(true);
  };

  const handleAddSubmit = async () => {
    if (!newMau.trim()) {
      toast.error("Vui lòng nhập tên màu");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/mau", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_mau: newMau,
        }),
      });

      if (response.ok) {
        toast.success("Thêm màu thành công");
        fetchDanhSachMau();
        setShowAddDialog(false);
      } else {
        toast.error("Lỗi khi thêm màu");
      }
    } catch {
      toast.error("Lỗi khi thêm màu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (mau: Mau) => {
    setEditingMau(mau);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (updatedName: string) => {
    if (!editingMau) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/mau/${editingMau.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_mau: updatedName,
        }),
      });

      if (response.ok) {
        toast.success("Cập nhật thành công");
        fetchDanhSachMau();
        setShowEditDialog(false);
      } else {
        toast.error("Lỗi khi cập nhật");
      }
    } catch {
      toast.error("Lỗi khi cập nhật");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.mau) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/mau/${deleteDialog.mau.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa màu");
      }
      toast.success("Xóa thành công");
      fetchDanhSachMau();
      setDeleteDialog({ isOpen: false, mau: null });
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(error instanceof Error ? error.message : "Lỗi khi xóa màu");
    } finally {
      setSubmitting(false);
      setDeleteDialog({ isOpen: false, mau: null });
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
      <MauTable
        loading={loading}
        data={filteredMau}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleEdit}
        onDelete={(mau) => setDeleteDialog({ isOpen: true, mau })}
        onAdd={handleAdd}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <FormDialog
        mode="add"
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        value={newMau}
        onChange={setNewMau}
        onSubmit={handleAddSubmit}
        isLoading={submitting}
      />

      <FormDialog
        mode="edit"
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        value={editingMau?.ten_mau || ""}
        onChange={(value) =>
          setEditingMau(editingMau ? { ...editingMau, ten_mau: value } : null)
        }
        onSubmit={() => handleEditSubmit(editingMau?.ten_mau || "")}
        isLoading={submitting}
      />

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ isOpen: false, mau: null })
        }
        onConfirm={handleConfirmDelete}
        item={deleteDialog.mau}
      />
    </div>
  );
};

export default Page;
