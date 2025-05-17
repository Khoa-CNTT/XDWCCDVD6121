"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SoGheCombobox } from "@/components/ui/soghe-combobox";
import { SoDayGheCombobox } from "@/components/ui/sodayghe-combobox";
import { toast } from "sonner";
import { MauCombobox } from "@/components/ui/mau-combobox";

interface ValidationErrors {
  ten_rap: string;
  mau_id: string;
  so_ghe_id: string;
  so_day_ghe_id: string;
  gia_thue: string;
  anh_rap: string;
}

interface Mau {
  id: number;
  ten_mau: string;
}

interface SoGhe {
  id: number;
  so_ghe: number;
}

interface SoDayGhe {
  id: number;
  so_day_ghe: number;
}

interface FormData {
  ten_rap: string;
  mau_id: number;
  so_ghe_id: number;
  so_day_ghe_id: number;
  gia_thue: number;
  anh_rap: string;
}

interface RapCuoiFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: FormData;
  mauList: Mau[];
  soGheList: SoGhe[];
  soDayGheList: SoDayGhe[];
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: Partial<FormData>) => void;
  linkError: string | null;
  onImageClick?: (url: string, title: string) => void;
}

const RapCuoiFormDialog = ({
  isOpen,
  onOpenChange,
  isEditMode,
  formData,
  mauList,
  soGheList,
  soDayGheList,
  onSubmit,
  onFormDataChange,
  linkError,
  onImageClick,
}: RapCuoiFormDialogProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({
    ten_rap: "",
    mau_id: "",
    so_ghe_id: "",
    so_day_ghe_id: "",
    gia_thue: "",
    anh_rap: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      ten_rap: "",
      mau_id: "",
      so_ghe_id: "",
      so_day_ghe_id: "",
      gia_thue: "",
      anh_rap: "",
    };

    // Validate tên rạp
    if (!formData.ten_rap.trim()) {
      newErrors.ten_rap = "Vui lòng nhập tên rạp";
      isValid = false;
    } else if (formData.ten_rap.length < 3) {
      newErrors.ten_rap = "Tên rạp phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Validate màu
    if (!formData.mau_id) {
      newErrors.mau_id = "Vui lòng chọn màu";
      isValid = false;
    }

    // Validate số ghế
    if (!formData.so_ghe_id) {
      newErrors.so_ghe_id = "Vui lòng chọn số ghế";
      isValid = false;
    }

    // Validate số dãy ghế
    if (!formData.so_day_ghe_id) {
      newErrors.so_day_ghe_id = "Vui lòng chọn số dãy ghế";
      isValid = false;
    }

    // Validate giá thuê
    if (formData.gia_thue <= 0) {
      newErrors.gia_thue = "Giá thuê phải lớn hơn 0";
      isValid = false;
    }

    // Validate URL ảnh
    if (!formData.anh_rap) {
      newErrors.anh_rap = "Vui lòng nhập URL hình ảnh";
      isValid = false;
    } else if (
      !formData.anh_rap.match(
        /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif)$/
      )
    ) {
      newErrors.anh_rap =
        "URL không hợp lệ. Vui lòng sử dụng URL hình ảnh từ Imgur";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(errors).find((error) => error !== "");
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);
    onSubmit(e);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Sửa Rạp Cưới" : "Thêm Rạp Cưới Mới"}
          </DialogTitle>
        </DialogHeader>
        <form id="form-them-rap" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="ten_rap">Tên Rạp</Label>
            <Input
              id="ten_rap"
              value={formData.ten_rap}
              onChange={(e) => {
                onFormDataChange({ ten_rap: e.target.value });
                setErrors({ ...errors, ten_rap: "" });
              }}
              className={errors.ten_rap ? "border-red-500" : ""}
              required
            />
            {errors.ten_rap && (
              <p className="text-sm text-red-500 mt-1">{errors.ten_rap}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label>Mã Màu</Label>
            <MauCombobox
              mauList={mauList}
              value={formData.mau_id.toString()}
              onChange={(value) => {
                onFormDataChange({ mau_id: parseInt(value) });
                setErrors({ ...errors, mau_id: "" });
              }}
            />
            {errors.mau_id && (
              <p className="text-sm text-red-500 mt-1">{errors.mau_id}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label>Số Ghế</Label>
            <SoGheCombobox
              soGheList={soGheList}
              value={formData.so_ghe_id.toString()}
              onChange={(value) => {
                onFormDataChange({ so_ghe_id: parseInt(value) });
                setErrors({ ...errors, so_ghe_id: "" });
              }}
            />
            {errors.so_ghe_id && (
              <p className="text-sm text-red-500 mt-1">{errors.so_ghe_id}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label>Số Dãy Ghế</Label>
            <SoDayGheCombobox
              soDayGheList={soDayGheList}
              value={formData.so_day_ghe_id.toString()}
              onChange={(value) => {
                onFormDataChange({ so_day_ghe_id: parseInt(value) });
                setErrors({ ...errors, so_day_ghe_id: "" });
              }}
            />
            {errors.so_day_ghe_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.so_day_ghe_id}
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="gia_thue">Giá Thuê</Label>
            <Input
              id="gia_thue"
              type="number"
              value={formData.gia_thue}
              onChange={(e) => {
                onFormDataChange({ gia_thue: Number(e.target.value) });
                setErrors({ ...errors, gia_thue: "" });
              }}
              className={errors.gia_thue ? "border-red-500" : ""}
              required
            />
            {errors.gia_thue && (
              <p className="text-sm text-red-500 mt-1">{errors.gia_thue}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="anh_rap">Link Ảnh</Label>
            <Input
              id="anh_rap"
              value={formData.anh_rap}
              onChange={(e) => {
                onFormDataChange({ anh_rap: e.target.value });
                setErrors({ ...errors, anh_rap: "" });
              }}
              className={errors.anh_rap ? "border-red-500" : ""}
              placeholder="https://i.imgur.com/xxxxxx.jpg"
              required
            />
            <p className="text-sm text-muted-foreground">
              Chỉ chấp nhận URL hình ảnh từ Imgur (https://i.imgur.com/...)
            </p>
            {(errors.anh_rap || linkError) && (
              <p className="text-sm text-red-500 mt-1">
                {errors.anh_rap || linkError}
              </p>
            )}
            {formData.anh_rap && !errors.anh_rap && !linkError && (
              <div className="mt-2 flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">
                  Click vào ảnh để xem ở kích thước đầy đủ
                </span>
                <div
                  className="cursor-pointer hover:opacity-80"
                  onClick={() =>
                    onImageClick?.(formData.anh_rap, formData.ten_rap)
                  }
                >
                  <img
                    id="preview-anh-rap"
                    src={formData.anh_rap}
                    alt="Preview ảnh rạp cưới"
                    className="w-40 h-40 object-contain rounded border border-gray-300 bg-white"
                    onError={() => {
                      setErrors({
                        ...errors,
                        anh_rap:
                          "Không thể tải hình ảnh. Vui lòng kiểm tra URL",
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || !!linkError}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : isEditMode ? (
                "Cập Nhật"
              ) : (
                "Thêm Mới"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RapCuoiFormDialog;
