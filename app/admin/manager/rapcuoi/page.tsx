"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RapCuoiTable from "./components/RapCuoiTable";
import RapCuoiFormDialog from "./components/RapCuoiFormDialog";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import DeleteDialog from "./components/DeleteDialog";

interface RapCuoi {
  id: number;
  ten_rap: string;
  mau_id: number;
  so_ghe_id: number;
  so_day_ghe_id: number;
  gia_thue: number;
  anh_rap: string;
}

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

export default function QuanLyRapCuoi() {
  const [rapCuois, setRapCuois] = useState<RapCuoi[]>([]);
  const [mauList, setMauList] = useState<Mau[]>([]);
  const [soGheList, setSoGheList] = useState<SoGhe[]>([]);
  const [soDayGheList, setSoDayGheList] = useState<SoDayGhe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    ten_rap: "",
    mau_id: 0,
    so_ghe_id: 0,
    so_day_ghe_id: 0,
    gia_thue: 0,
    anh_rap: "",
  });
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: RapCuoi | null;
  }>({
    isOpen: false,
    item: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchRapCuois();
    fetchMauList();
    fetchSoGheList();
    fetchSoDayGheList();
  }, []);

  const fetchRapCuois = async () => {
    try {
      const response = await fetch("/api/rapcuoi");
      const data = await response.json();
      setRapCuois(data.datas);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu rạp cưới:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu rạp cưới");
    }
  };

  const fetchMauList = async () => {
    try {
      const response = await fetch("/api/mau");
      const data = await response.json();
      setMauList(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu mã màu:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu mã màu");
    }
  };

  const fetchSoGheList = async () => {
    try {
      const response = await fetch("/api/soghe");
      const data = await response.json();
      setSoGheList(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số ghế:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu số ghế");
    }
  };

  const fetchSoDayGheList = async () => {
    try {
      const response = await fetch("/api/sodayghe");
      const data = await response.json();
      setSoDayGheList(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số dãy ghế:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu số dãy ghế");
    }
  };

  const handleEdit = (rapCuoi: RapCuoi) => {
    setIsEditMode(true);
    setEditingId(rapCuoi.id);
    setFormData({
      ten_rap: rapCuoi.ten_rap,
      mau_id: rapCuoi.mau_id,
      so_ghe_id: rapCuoi.so_ghe_id,
      so_day_ghe_id: rapCuoi.so_day_ghe_id,
      gia_thue: rapCuoi.gia_thue,
      anh_rap: rapCuoi.anh_rap,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    const item = rapCuois.find((item) => item.id === id);
    if (item) {
      setDeleteDialog({ isOpen: true, item });
    }
  };

  const confirmDelete = async () => {
    const id = deleteDialog.item?.id;
    if (!id) return;

    try {
      const response = await fetch(`/api/rapcuoi/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Xóa rạp cưới thành công");
        fetchRapCuois();
        setDeleteDialog({ isOpen: false, item: null });
      } else {
        toast.error("Không thể xóa rạp cưới");
      }
    } catch {
      toast.error("Đã có lỗi xảy ra khi xóa");
    }
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };

      // Validate imgur link if anh_rap is changed
      if ("anh_rap" in data) {
        const imgurRegex = /^(https?:\/\/)?(i\.)?imgur\.com\//;
        if (data.anh_rap && !imgurRegex.test(data.anh_rap)) {
          setLinkError(
            "Link ảnh không hợp lệ. Vui lòng sử dụng link từ imgur.com"
          );
        } else {
          setLinkError(null);
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (linkError) {
      toast.error(linkError);
      return;
    }

    try {
      if (isEditMode && editingId) {
        const response = await fetch(`/api/rapcuoi/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Cập nhật rạp cưới thành công");
          setIsOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          fetchRapCuois();
          resetForm();
        } else {
          toast.error("Không thể cập nhật rạp cưới");
        }
      } else {
        const response = await fetch("/api/rapcuoi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Thêm rạp cưới thành công");
          setIsOpen(false);
          fetchRapCuois();
          resetForm();
        } else {
          toast.error("Không thể thêm rạp cưới");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm/sửa rạp cưới:", error);
      toast.error("Có lỗi xảy ra khi thêm/sửa rạp cưới");
    }
  };

  const resetForm = () => {
    setFormData({
      ten_rap: "",
      mau_id: 0,
      so_ghe_id: 0,
      so_day_ghe_id: 0,
      gia_thue: 0,
      anh_rap: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size, 10));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="p-8">
      <RapCuoiTable
        rapCuois={rapCuois}
        mauList={mauList}
        soGheList={soGheList}
        soDayGheList={soDayGheList}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImageClick={(url, title) => setSelectedImage({ url, title })}
        onAddNew={() => {
          resetForm();
          setIsOpen(true);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <RapCuoiFormDialog
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setIsEditMode(false);
            setEditingId(null);
            resetForm();
          }
        }}
        isEditMode={isEditMode}
        formData={formData}
        mauList={mauList}
        soGheList={soGheList}
        soDayGheList={soDayGheList}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange}
        linkError={linkError}
        onImageClick={(url: string, title: string) =>
          setSelectedImage({ url, title })
        }
      />{" "}
      <ImagePreviewDialog
        image={selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      />
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, isOpen: open }))
        }
        onConfirm={confirmDelete}
        item={deleteDialog.item}
      />
    </div>
  );
}
