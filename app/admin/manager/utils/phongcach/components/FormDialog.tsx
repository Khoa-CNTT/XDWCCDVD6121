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

interface FormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  value: string;
  onChange: (value: string) => void;
  mode: "add" | "edit";
}

const FormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  value,
  onChange,
  mode,
}: FormDialogProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "add" ? "Thêm phong cách mới" : "Sửa phong cách"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Label htmlFor="ten_phong_cach" className="mb-2 inline-block">
              Tên phong cách
            </Label>
            <Input
              id="ten_phong_cach"
              placeholder="Nhập tên phong cách..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-lg py-3"
              autoComplete="off"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 text-base"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 text-base"
              disabled={isSubmitting || !value.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {mode === "add" ? "Đang thêm..." : "Đang cập nhật..."}
                </>
              ) : mode === "add" ? (
                "Thêm mới"
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
