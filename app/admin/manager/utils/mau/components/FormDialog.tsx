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

interface FormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
  mode?: "add" | "edit";
}

const FormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  value,
  onChange,
  mode = "add",
}: FormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Thêm màu mới" : "Sửa màu"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="tenMau" className="mb-2 inline-block">
            Tên màu
          </Label>
          <Input
            id="ten_mau"
            placeholder="Nhập tên màu..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-1">⏳</span>
                Đang xử lý...
              </>
            ) : mode === "add" ? (
              "Thêm"
            ) : (
              "Lưu"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
