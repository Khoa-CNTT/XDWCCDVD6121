"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PhongCachCombobox } from "@/components/ui/phongcach-combobox";
import { Textarea } from "@/components/ui/textarea";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface PhongCach {
  id: number;
  ten_phong_cach: string;
}

interface FormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  urlError: string;
  phongCachList: PhongCach[];
  mode: "add" | "edit";
  formValues: {
    tenMakeup: string;
    giaMakeup: string;
    phongCachId: string;
    anhMakeup: string;
    chiTiet: string;
  };
  onFormChange: {
    setTenMakeup: (value: string) => void;
    setGiaMakeup: (value: string) => void;
    setPhongCachId: (value: string) => void;
    setAnhMakeup: (value: string) => void;
    setChiTiet: (value: string) => void;
  };
}

interface ValidationErrors {
  tenMakeup: string;
  giaMakeup: string;
  phongCachId: string;
  anhMakeup: string;
  chiTiet: string;
}

const FormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  urlError,
  phongCachList,
  mode,
  formValues,
  onFormChange,
}: FormDialogProps) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    tenMakeup: "",
    giaMakeup: "",
    phongCachId: "",
    anhMakeup: "",
    chiTiet: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      tenMakeup: "",
      giaMakeup: "",
      phongCachId: "",
      anhMakeup: "",
      chiTiet: "",
    };

    // Validate tên makeup
    if (!formValues.tenMakeup.trim()) {
      newErrors.tenMakeup = "Vui lòng nhập tên makeup";
      isValid = false;
    } else if (formValues.tenMakeup.length < 3) {
      newErrors.tenMakeup = "Tên makeup phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Validate giá makeup
    if (!formValues.giaMakeup) {
      newErrors.giaMakeup = "Vui lòng nhập giá";
      isValid = false;
    } else if (Number(formValues.giaMakeup) <= 0) {
      newErrors.giaMakeup = "Giá phải lớn hơn 0";
      isValid = false;
    }

    // Validate phong cách
    if (!formValues.phongCachId) {
      newErrors.phongCachId = "Vui lòng chọn phong cách";
      isValid = false;
    }

    // Validate ảnh makeup
    if (!formValues.anhMakeup) {
      newErrors.anhMakeup = "Vui lòng nhập URL hình ảnh";
      isValid = false;
    } else if (
      !formValues.anhMakeup.match(
        /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif)$/
      )
    ) {
      newErrors.anhMakeup =
        "URL không hợp lệ. Vui lòng sử dụng URL hình ảnh từ Imgur";
      isValid = false;
    }

    // Validate chi tiết
    if (!formValues.chiTiet.trim()) {
      newErrors.chiTiet = "Vui lòng nhập chi tiết";
      isValid = false;
    } else if (formValues.chiTiet.length < 10) {
      newErrors.chiTiet = "Chi tiết phải có ít nhất 10 ký tự";
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

    await onSubmit();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Thêm Makeup" : "Sửa Makeup"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tenMakeup">Tên Makeup</Label>
              <Input
                id="tenMakeup"
                value={formValues.tenMakeup}
                onChange={(e) => {
                  onFormChange.setTenMakeup(e.target.value);
                  setErrors({ ...errors, tenMakeup: "" });
                }}
                className={errors.tenMakeup ? "border-red-500" : ""}
                placeholder="Nhập tên makeup..."
              />
              {errors.tenMakeup && (
                <p className="text-sm text-red-500">{errors.tenMakeup}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="giaMakeup">Giá Makeup</Label>
              <Input
                id="giaMakeup"
                type="number"
                value={formValues.giaMakeup}
                onChange={(e) => {
                  onFormChange.setGiaMakeup(e.target.value);
                  setErrors({ ...errors, giaMakeup: "" });
                }}
                className={errors.giaMakeup ? "border-red-500" : ""}
                placeholder="Nhập giá makeup..."
              />
              {errors.giaMakeup && (
                <p className="text-sm text-red-500">{errors.giaMakeup}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Phong Cách</Label>
              <PhongCachCombobox
                phongcachList={phongCachList}
                value={formValues.phongCachId}
                onChange={(value) => {
                  onFormChange.setPhongCachId(value);
                  setErrors({ ...errors, phongCachId: "" });
                }}
              />
              {errors.phongCachId && (
                <p className="text-sm text-red-500">{errors.phongCachId}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="anhMakeup">URL Ảnh</Label>
              <Input
                id="anhMakeup"
                value={formValues.anhMakeup}
                onChange={(e) => {
                  onFormChange.setAnhMakeup(e.target.value);
                  setErrors({ ...errors, anhMakeup: "" });
                }}
                className={errors.anhMakeup ? "border-red-500" : ""}
                placeholder="https://i.imgur.com/xxxxxx.jpg"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Chỉ chấp nhận URL hình ảnh từ Imgur (https://i.imgur.com/...)
              </p>
              {(errors.anhMakeup || urlError) && (
                <p className="text-sm text-red-500">
                  {errors.anhMakeup || urlError}
                </p>
              )}
              {formValues.anhMakeup && !errors.anhMakeup && !urlError && (
                <div
                  className="relative h-40 cursor-pointer"
                  onClick={() => setShowImageDialog(true)}
                >
                  <Image
                    src={formValues.anhMakeup}
                    alt="Preview"
                    fill
                    className="object-contain"
                    onError={() => {
                      setErrors({
                        ...errors,
                        anhMakeup:
                          "Không thể tải hình ảnh. Vui lòng kiểm tra URL",
                      });
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="chiTiet">Chi Tiết</Label>
              <Textarea
                id="chiTiet"
                value={formValues.chiTiet}
                onChange={(e) => {
                  onFormChange.setChiTiet(e.target.value);
                  setErrors({ ...errors, chiTiet: "" });
                }}
                className={errors.chiTiet ? "border-red-500" : ""}
                placeholder="Nhập chi tiết makeup..."
                rows={5}
              />
              {errors.chiTiet && (
                <p className="text-sm text-red-500">{errors.chiTiet}</p>
              )}
            </div>

            <DialogFooter>
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
                  "Thêm Mới"
                ) : (
                  "Cập Nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>{" "}
      <ImagePreviewDialog
        image={
          showImageDialog
            ? {
                url: formValues.anhMakeup,
                title: formValues.tenMakeup,
              }
            : null
        }
        onOpenChange={setShowImageDialog}
      />
    </>
  );
};

export default FormDialog;
