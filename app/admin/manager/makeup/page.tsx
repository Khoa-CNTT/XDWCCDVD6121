"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import MakeupTable from "./components/MakeupTable";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";

interface Makeup {
  id: number;
  ten_makeup: string;
  gia_makeup: number;
  phong_cach_id: number;
  anh_makeup: string;
  chi_tiet: string;
  phong_cach_relation?: {
    ten_phong_cach: string;
  };
}

interface PhongCach {
  id: number;
  ten_phong_cach: string;
}

export default function MakeupPage() {
  const [makeupList, setMakeupList] = useState<Makeup[]>([]);
  const [phongCachList, setPhongCachList] = useState<PhongCach[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [currentMakeup, setCurrentMakeup] = useState<Makeup | null>(null);

  // Form states
  const [tenMakeup, setTenMakeup] = useState("");
  const [giaMakeup, setGiaMakeup] = useState("");
  const [phongCachId, setPhongCachId] = useState("");
  const [anhMakeup, setAnhMakeup] = useState("");
  const [chiTiet, setChiTiet] = useState("");
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch makeup data
      const makeupResponse = await fetch("/api/makeup");
      const makeupData = await makeupResponse.json();

      // Fetch phong cách data
      const phongCachResponse = await fetch("/api/phongcach");
      const phongCachData = await phongCachResponse.json();

      // Get detailed makeup with phong cách name
      const detailedMakeup = await Promise.all(
        makeupData.datas.map(async (makeup: Makeup) => {
          const phongCach = phongCachData.datas.find(
            (pc: PhongCach) => pc.id === makeup.phong_cach_id
          );
          return {
            ...makeup,
            phong_cach_relation: phongCach
              ? { ten_phong_cach: phongCach.ten_phong_cach }
              : undefined,
          };
        })
      );

      setMakeupList(detailedMakeup);
      setPhongCachList(phongCachData.datas);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu makeup!");
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };
  const handleAdd = async () => {
    if (!tenMakeup || !giaMakeup || !phongCachId || !anhMakeup || !chiTiet) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!validateImageUrl(anhMakeup)) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/makeup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_makeup: tenMakeup,
          gia_makeup: parseInt(giaMakeup),
          phong_cach_id: parseInt(phongCachId),
          anh_makeup: anhMakeup,
          chi_tiet: chiTiet,
        }),
      });

      if (!response.ok) throw new Error("Lỗi khi thêm makeup");

      toast.success("Thêm dịch vụ makeup thành công!");
      setOpenAddDialog(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi thêm dịch vụ makeup!");
    } finally {
      setSubmitting(false);
    }
  };
  const handleEdit = async () => {
    if (
      !currentMakeup ||
      !tenMakeup ||
      !giaMakeup ||
      !phongCachId ||
      !anhMakeup ||
      !chiTiet
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!validateImageUrl(anhMakeup)) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/makeup/${currentMakeup.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_makeup: tenMakeup,
          gia_makeup: parseInt(giaMakeup),
          phong_cach_id: parseInt(phongCachId),
          anh_makeup: anhMakeup,
          chi_tiet: chiTiet,
        }),
      });

      if (!response.ok) throw new Error("Lỗi khi cập nhật makeup");

      toast.success("Cập nhật dịch vụ makeup thành công!");
      setOpenEditDialog(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi cập nhật dịch vụ makeup!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMakeup) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/makeup/${currentMakeup.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Lỗi khi xóa makeup");

      toast.success("Xóa dịch vụ makeup thành công!");
      setOpenDeleteDialog(false);
      setCurrentMakeup(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi xóa dịch vụ makeup!");
    } finally {
      setSubmitting(false);
    }
  };
  const validateImageUrl = (url: string) => {
    const imgurRegex = /^(https?:\/\/)?(i\.)?imgur\.com\//;
    if (url && !imgurRegex.test(url)) {
      setUrlError("Link ảnh không hợp lệ. Vui lòng sử dụng link từ imgur.com");
      return false;
    }
    setUrlError("");
    return true;
  };

  const resetForm = () => {
    setTenMakeup("");
    setGiaMakeup("");
    setPhongCachId("");
    setAnhMakeup("");
    setChiTiet("");
    setUrlError("");
    setCurrentMakeup(null);
  };

  return (
    <div className="p-8">
      <MakeupTable
        loading={loading}
        makeupList={makeupList}
        search={search}
        onSearchChange={setSearch}
        onAdd={() => {
          resetForm();
          setOpenAddDialog(true);
        }}
        onEdit={(item) => {
          setCurrentMakeup(item);
          setTenMakeup(item.ten_makeup);
          setGiaMakeup(item.gia_makeup.toString());
          setPhongCachId(item.phong_cach_id.toString());
          const url = item.anh_makeup;
          setAnhMakeup(url);
          validateImageUrl(url);
          setChiTiet(item.chi_tiet);
          setOpenEditDialog(true);
        }}
        onDelete={(item) => {
          setCurrentMakeup(item);
          setOpenDeleteDialog(true);
        }}
        onImageClick={(url: string, title: string) =>
          setSelectedImage({ url, title })
        }
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <FormDialog
        isOpen={openAddDialog || openEditDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
            setOpenAddDialog(false);
            setOpenEditDialog(false);
          }
        }}
        mode={openAddDialog ? "add" : "edit"}
        phongCachList={phongCachList}
        isSubmitting={submitting}
        urlError={urlError}
        formValues={{
          tenMakeup,
          giaMakeup,
          phongCachId,
          anhMakeup,
          chiTiet,
        }}
        onFormChange={{
          setTenMakeup,
          setGiaMakeup,
          setPhongCachId,
          setAnhMakeup: (url: string) => {
            setAnhMakeup(url);
            validateImageUrl(url);
          },
          setChiTiet,
        }}
        onSubmit={openAddDialog ? handleAdd : handleEdit}
      />
      <DeleteDialog
        isOpen={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDelete}
        isSubmitting={submitting}
        data={currentMakeup}
      />{" "}
      <ImagePreviewDialog
        image={selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      />
    </div>
  );
}
