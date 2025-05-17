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
            {mode === "add" ? "Thêm độ tuổi mới" : "Chỉnh sửa độ tuổi"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="dotuoi">Độ tuổi</Label>
            <Input
              id="dotuoi"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Nhập độ tuổi"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Hủy
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <span className="animate-spin">...</span>
            ) : mode === "add" ? (
              "Thêm mới"
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
