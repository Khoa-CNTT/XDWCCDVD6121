"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VayCuoiTable } from "./components/VayCuoiTable";
import { DeleteDialog } from "./components/DeleteDialog";
import InstanceDialog from "./components/InstanceDialog";
import { FormDialog } from "./components/FormDialog";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface VayInstance {
  id: number;
  vay_id: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  rental_start: string | null;
  rental_end: string | null;
}

interface VayCuoi {
  id: number;
  ten: string;
  gia: number;
  anh: string;
  mau_id: number;
  size_id: number;
  do_tuoi_id: number;
  instances: VayInstance[];
  mau_release: { ten_mau: string };
  size_relation: { size: string };
  do_tuoi_relation: { dotuoi: number };
}

export default function QlyVayCuoi() {
  // State for dialogs
  const [selectedDress, setSelectedDress] = useState<VayCuoi | null>(null);
  const [editingVay, setEditingVay] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [dressIdToDelete, setDressIdToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const { data, isLoading, mutate } = useSWR<{ datas: VayCuoi[] }>(
    "/api/vaycuoi",
    fetcher
  );

  // Filter and paginate data
  const filteredData = useMemo(() => {
    const vaycuois = data?.datas || [];
    const searchLower = searchTerm.toLowerCase();
    return vaycuois.filter(
      (vay) =>
        vay.ten.toLowerCase().includes(searchLower) ||
        vay.mau_release.ten_mau.toLowerCase().includes(searchLower) ||
        vay.size_relation.size.toLowerCase().includes(searchLower)
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const onDelete = async (id: number) => {
    setDressIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!dressIdToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/vaycuoi/${dressIdToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Xóa thành công");
      mutate();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDressIdToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Quản Lý Váy Cưới</h1>
          <p className="text-gray-500 mt-2">
            Quản lý danh sách váy cưới và các phiên bản của chúng
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowCreateDialog(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Thêm váy cưới
        </Button>
      </div>
      <VayCuoiTable
        data={paginatedData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={setSelectedDress}
        onEdit={setEditingVay}
        onDelete={onDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(Number(size));
          setCurrentPage(1);
        }}
        onImageClick={setSelectedImage}
      />{" "}
      <FormDialog
        mode="add"
        isOpen={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={mutate}
      />
      {selectedDress && (
        <InstanceDialog
          isOpen={!!selectedDress}
          onClose={() => setSelectedDress(null)}
          instances={selectedDress.instances || []}
          dressName={selectedDress.ten}
        />
      )}
      {editingVay && (
        <FormDialog
          mode="edit"
          isOpen={!!editingVay}
          onOpenChange={() => setEditingVay(null)}
          onSuccess={mutate}
          data={data?.datas.find((vay) => vay.id === editingVay)}
        />
      )}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
      <ImagePreviewDialog
        image={selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      />
    </div>
  );
}
