"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Size {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

interface FormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "add" | "edit";
  editingSize?: Size | null;
}

interface ValidationErrors {
  size?: string;
  height?: string;
  weight?: string;
}

type FormDataType = {
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
};

const initialFormData: FormDataType = {
  size: "",
  min_chieu_cao: 0,
  max_chieu_cao: 0,
  min_can_nang: 0,
  max_can_nang: 0,
};

export function FormDialog({
  isOpen,
  onOpenChange,
  onSuccess,
  mode,
  editingSize,
}: FormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Reset form data when dialog opens or when editingSize changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && editingSize) {
        setFormData({
          size: editingSize.size,
          min_chieu_cao: editingSize.min_chieu_cao,
          max_chieu_cao: editingSize.max_chieu_cao,
          min_can_nang: editingSize.min_can_nang,
          max_can_nang: editingSize.max_can_nang,
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({}); // Reset errors when dialog opens
    }
  }, [isOpen, mode, editingSize]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate size
    if (!formData.size.trim()) {
      newErrors.size = "Size không được để trống";
    }

    // Validate height
    if (formData.min_chieu_cao < 0 || formData.max_chieu_cao < 0) {
      newErrors.height = "Chiều cao không được âm";
    } else if (formData.min_chieu_cao >= formData.max_chieu_cao) {
      newErrors.height = "Chiều cao tối thiểu phải nhỏ hơn chiều cao tối đa";
    }

    // Validate weight
    if (formData.min_can_nang < 0 || formData.max_can_nang < 0) {
      newErrors.weight = "Cân nặng không được âm";
    } else if (formData.min_can_nang >= formData.max_can_nang) {
      newErrors.weight = "Cân nặng tối thiểu phải nhỏ hơn cân nặng tối đa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl =
        mode === "edit" && editingSize
          ? `/api/size/${editingSize.id}`
          : "/api/size";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success(
          mode === "add" ? "Thêm size thành công" : "Cập nhật size thành công"
        );
        onOpenChange(false);
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể lưu size");
      }
    } catch (error) {
      console.error("Error saving size:", error);
      toast.error(error instanceof Error ? error.message : "Lỗi khi lưu size");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Thêm size mới" : "Cập nhật size"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Thêm một size mới vào hệ thống"
              : "Cập nhật thông tin size có sẵn"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Size
            </Label>
            <div className="col-span-3">
              <Input
                id="size"
                className={errors.size ? "border-red-500" : ""}
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
              {errors.size && (
                <p className="text-sm text-red-500 mt-1">{errors.size}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min_chieu_cao" className="text-right">
                Chiều cao tối thiểu
              </Label>
              <Input
                id="min_chieu_cao"
                type="number"
                className={`col-span-3 ${
                  errors.height ? "border-red-500" : ""
                }`}
                value={formData.min_chieu_cao}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_chieu_cao: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_chieu_cao" className="text-right">
                Chiều cao tối đa
              </Label>
              <div className="col-span-3">
                <Input
                  id="max_chieu_cao"
                  type="number"
                  className={errors.height ? "border-red-500" : ""}
                  value={formData.max_chieu_cao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_chieu_cao: Number(e.target.value),
                    })
                  }
                />
                {errors.height && (
                  <p className="text-sm text-red-500 mt-1">{errors.height}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min_can_nang" className="text-right">
                Cân nặng tối thiểu
              </Label>
              <Input
                id="min_can_nang"
                type="number"
                className={`col-span-3 ${
                  errors.weight ? "border-red-500" : ""
                }`}
                value={formData.min_can_nang}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_can_nang: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_can_nang" className="text-right">
                Cân nặng tối đa
              </Label>
              <div className="col-span-3">
                <Input
                  id="max_can_nang"
                  type="number"
                  className={errors.weight ? "border-red-500" : ""}
                  value={formData.max_can_nang}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_can_nang: Number(e.target.value),
                    })
                  }
                />
                {errors.weight && (
                  <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Đang lưu..."
              : mode === "add"
                ? "Thêm mới"
                : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
