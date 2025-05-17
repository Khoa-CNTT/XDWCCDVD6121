"use client"

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface SoDayGhe {
  id: number
  so_luong_day_ghe: number
}

interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: SoDayGhe | null
  onConfirm: () => void
}

const DeleteDialog = ({
  isOpen,
  onOpenChange,
  item,
  onConfirm,
}: DeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa số dãy ghế</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa số dãy ghế {item?.so_luong_day_ghe} (ID: {item?.id}) không? 
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Xác nhận xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
