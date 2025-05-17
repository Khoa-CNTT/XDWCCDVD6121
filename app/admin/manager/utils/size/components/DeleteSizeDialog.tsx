"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteSizeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sizeId: number | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export default function DeleteSizeDialog({
  isOpen,
  onOpenChange,
  sizeId,
  onConfirm,
  isDeleting = false,
}: DeleteSizeDialogProps) {
  if (!sizeId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Bạn có chắc chắn muốn xóa size này?</p>
          <p className="text-sm text-muted-foreground mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
