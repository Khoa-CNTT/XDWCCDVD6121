"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import { Loader2 } from "lucide-react";
import { SizeCombobox } from "@/components/ui/size-combobox";
import { MauCombobox } from "@/components/ui/mau-combobox";
import { DoTuoiCombobox } from "@/components/ui/dotuoi-combobox";
import { Textarea } from "@/components/ui/textarea";

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
  chi_tiet: string;
  instances: VayInstance[];
  mau_release: { ten_mau: string };
  size_relation: { size: string };
  do_tuoi_relation: { dotuoi: number };
}

interface MauVay {
  id: number;
  ten_mau: string;
}

interface KichThuoc {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

interface DoTuoi {
  id: number;
  dotuoi: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface FormDialogProps {
  mode: "add" | "edit";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  data?: VayCuoi;
}

export function FormDialog({
  mode,
  isOpen,
  onOpenChange,
  onSuccess,
  data,
}: FormDialogProps) {
  const { data: mauData } = useSWR<{ datas: MauVay[] }>("/api/mau", fetcher);
  const { data: sizeData } = useSWR<{ datas: KichThuoc[] }>(
    "/api/size",
    fetcher
  );
  const { data: doTuoiData } = useSWR<{ datas: DoTuoi[] }>(
    "/api/dotuoi",
    fetcher
  );
  // Form state
  const [formData, setFormData] = useState({
    ten: "",
    gia: 0,
    anh: "",
    mau_id: 0,
    size_id: 0,
    chi_tiet: "",
    do_tuoi_id: 0,
    so_luong: 1,
  });

  // Validation state
  const [errors, setErrors] = useState({
    ten: "",
    gia: "",
    anh: "",
    mau_id: "",
    size_id: "",
    chi_tiet: "",
    do_tuoi_id: "",
    so_luong: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      ten: "",
      gia: "",
      anh: "",
      mau_id: "",
      size_id: "",
      chi_tiet: "",
      do_tuoi_id: "",
      so_luong: "",
    };

    // Validate tên
    if (!formData.ten.trim()) {
      newErrors.ten = "Vui lòng nhập tên váy cưới";
      isValid = false;
    } else if (formData.ten.length < 3) {
      newErrors.ten = "Tên váy cưới phải có ít nhất 3 ký tự";
      isValid = false;
    }
    // Validate chi tiết
    if (!formData.chi_tiet.trim()) {
      newErrors.chi_tiet = "Vui lòng nhập chi tiết váy cưới";
      isValid = false;
    } else if (formData.chi_tiet.length < 10) {
      newErrors.chi_tiet = "Chi tiết váy cưới phải có ít nhất 10 ký tự";
      isValid = false;
    }

    // Validate giá
    if (formData.gia <= 0) {
      newErrors.gia = "Giá phải lớn hơn 0";
      isValid = false;
    }

    // Validate ảnh
    if (!formData.anh) {
      newErrors.anh = "Vui lòng nhập URL hình ảnh";
      isValid = false;
    } else if (
      !formData.anh.match(
        /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif)$/
      )
    ) {
      newErrors.anh =
        "URL không hợp lệ. Vui lòng sử dụng URL hình ảnh từ Imgur";
      isValid = false;
    }

    // Validate màu
    if (!formData.mau_id) {
      newErrors.mau_id = "Vui lòng chọn màu sắc";
      isValid = false;
    }

    // Validate size
    if (!formData.size_id) {
      newErrors.size_id = "Vui lòng chọn kích thước";
      isValid = false;
    }

    // Validate độ tuổi
    if (!formData.do_tuoi_id) {
      newErrors.do_tuoi_id = "Vui lòng chọn độ tuổi";
      isValid = false;
    }

    // Validate số lượng
    if (formData.so_luong < 1) {
      newErrors.so_luong = "Số lượng phải ít nhất là 1";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const [imageError, setImageError] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && data) {
        setFormData({
          ten: data.ten,
          gia: data.gia,
          anh: data.anh,
          mau_id: data.mau_id,
          size_id: data.size_id,
          do_tuoi_id: data.do_tuoi_id,
          chi_tiet: data.chi_tiet,
          so_luong: data.instances?.length || 1,
        });

        if (
          data.anh &&
          data.anh.match(
            /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif)$/
          )
        ) {
          setPreviewUrl(data.anh);
        }
      } else {
        // Reset form data when opening in add mode
        setFormData({
          ten: "",
          gia: 0,
          anh: "",
          mau_id: 0,
          size_id: 0,
          chi_tiet: "",
          do_tuoi_id: 0,
          so_luong: 1,
        });
        setPreviewUrl("");
        setImageError("");
      }
    }
  }, [isOpen, mode, data]);

  const validateImageUrl = (url: string) => {
    if (!url) {
      setImageError("URL không được để trống");
      return false;
    }
    if (
      !url.match(/^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif)$/)
    ) {
      setImageError("URL không hợp lệ. Vui lòng sử dụng URL hình ảnh từ Imgur");
      return false;
    }
    setImageError("");
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      // Show first error as toast
      const firstError = Object.values(errors).find((error) => error !== "");
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        mode === "add" ? "/api/vaycuoi" : `/api/vaycuoi/${data?.id}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to submit");
      }

      toast.success(
        mode === "add" ? "Thêm váy cưới thành công" : "Cập nhật thành công"
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mauData || !sizeData || !doTuoiData) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "add"
                ? "Thêm váy cưới mới"
                : `Chỉnh sửa váy cưới ${formData.ten}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ten">Tên váy cưới</Label>
                <Input
                  id="ten"
                  value={formData.ten}
                  onChange={(e) => {
                    setFormData({ ...formData, ten: e.target.value });
                    setErrors({ ...errors, ten: "" }); // Clear error when user types
                  }}
                  className={errors.ten ? "border-red-500" : ""}
                  required
                />
                {errors.ten && (
                  <p className="text-sm text-red-500 mt-1">{errors.ten}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gia">Giá (VNĐ)</Label>
                <Input
                  id="gia"
                  type="number"
                  value={formData.gia}
                  onChange={(e) => {
                    setFormData({ ...formData, gia: parseInt(e.target.value) });
                    setErrors({ ...errors, gia: "" });
                  }}
                  className={errors.gia ? "border-red-500" : ""}
                  required
                />
                {errors.gia && (
                  <p className="text-sm text-red-500 mt-1">{errors.gia}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="so_luong">Số lượng</Label>
                <Input
                  id="so_luong"
                  type="number"
                  min="1"
                  value={formData.so_luong}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      so_luong: parseInt(e.target.value),
                    });
                    setErrors({ ...errors, so_luong: "" });
                  }}
                  className={errors.so_luong ? "border-red-500" : ""}
                  required
                />
                {errors.so_luong && (
                  <p className="text-sm text-red-500 mt-1">{errors.so_luong}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Số lượng váy sẽ quyết định số lượng instances có thể cho thuê
                  cùng lúc
                </p>
              </div>{" "}
              <div className="space-y-2">
                <Label>Màu sắc</Label>
                <MauCombobox
                  mauList={mauData.datas}
                  value={formData.mau_id.toString()}
                  onChange={(value) => {
                    setFormData({ ...formData, mau_id: parseInt(value) });
                    setErrors({ ...errors, mau_id: "" });
                  }}
                />
                {errors.mau_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.mau_id}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Kích thước</Label>
                <SizeCombobox
                  sizes={sizeData.datas}
                  value={formData.size_id.toString()}
                  onChange={(value) => {
                    setFormData({ ...formData, size_id: parseInt(value) });
                    setErrors({ ...errors, size_id: "" });
                  }}
                />
                {errors.size_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.size_id}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Độ tuổi</Label>
                <DoTuoiCombobox
                  doTuoiList={doTuoiData.datas}
                  value={formData.do_tuoi_id.toString()}
                  onChange={(value) => {
                    setFormData({ ...formData, do_tuoi_id: parseInt(value) });
                    setErrors({ ...errors, do_tuoi_id: "" });
                  }}
                />
                {errors.do_tuoi_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.do_tuoi_id}
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="chiTiet">Chi Tiết</Label>
                <Textarea
                  id="chiTiet"
                  value={formData.chi_tiet}
                  onChange={(e) => {
                    setFormData({ ...formData, chi_tiet: e.target.value });
                    setErrors({ ...errors, chi_tiet: "" });
                  }}
                  className={errors.chi_tiet ? "border-red-500" : ""}
                  placeholder="Nhập chi tiết váy cưới..."
                  rows={5}
                />
                {errors.chi_tiet && (
                  <p className="text-sm text-red-500">{errors.chi_tiet}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anh">Hình ảnh (URL Imgur)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input
                    id="anh"
                    value={formData.anh}
                    onChange={(e) => {
                      const url = e.target.value;
                      setFormData((prev) => ({ ...prev, anh: url }));
                      if (validateImageUrl(url)) {
                        setPreviewUrl(url);
                      }
                    }}
                    placeholder="https://i.imgur.com/xxxxxx.jpg"
                    required
                    className={imageError ? "border-red-500" : ""}
                  />
                  {imageError && (
                    <p className="text-sm text-red-500">{imageError}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Chỉ chấp nhận URL hình ảnh từ Imgur
                    (https://i.imgur.com/...)
                  </p>
                </div>
                {previewUrl && (
                  <div
                    className="relative aspect-square w-full max-w-[200px] cursor-pointer"
                    onClick={() =>
                      setSelectedImage({ url: previewUrl, title: formData.ten })
                    }
                  >
                    <span className="text-xs text-gray-500 mb-1">
                      Click vào ảnh để xem ở kích thước đầy đủ
                    </span>
                    <div className="group relative h-full w-full">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="rounded-md object-cover"
                        onError={() => {
                          setPreviewUrl("");
                          setImageError(
                            "Không thể tải hình ảnh. Vui lòng kiểm tra URL"
                          );
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : mode === "add" ? (
                  "Thêm mới"
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>{" "}
      <ImagePreviewDialog
        image={selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      />
    </>
  );
}
