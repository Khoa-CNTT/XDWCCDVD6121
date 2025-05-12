"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Trash2, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface PhongCach {
  id: string
  ten_phong_cach: string
}

export default function PhongCachPage() {
  const [phongCachList, setPhongCachList] = useState<PhongCach[]>([])
  const [newPhongCach, setNewPhongCach] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPhongCach, setEditingPhongCach] = useState<PhongCach | null>(null)
  const [updatedName, setUpdatedName] = useState("")

  // Fetch danh sách phong cách
  const fetchPhongCach = async () => {
    try {
      const response = await fetch("/api/phongcach")
      const data = await response.json()
      setPhongCachList(data.datas)
    } catch (error) {
      toast.error("Không thể tải danh sách phong cách")
    }
  }

  // Thêm phong cách mới
  const handleAddPhongCach = async () => {
    if (!newPhongCach.trim()) {
      toast.error("Vui lòng nhập tên phong cách")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/phongcach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ten_phong_cach: newPhongCach }),
      })

      if (response.ok) {
        toast.success("Thêm phong cách thành công")
        setNewPhongCach("")
        fetchPhongCach()
      } else {
        toast.error("Không thể thêm phong cách")
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  // Xóa phong cách
  const handleDeletePhongCach = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phong cách này?")) {
      return
    }
    
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/phongcach/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Xóa phong cách thành công")
        fetchPhongCach()
      } else {
        toast.error("Không thể xóa phong cách")
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi xóa")
    } finally {
      setIsDeleting(null)
    }
  }

  // Mở dialog sửa
  const openEditDialog = (item: PhongCach) => {
    setEditingPhongCach(item)
    setUpdatedName(item.ten_phong_cach)
    setEditDialogOpen(true)
  }

  // Cập nhật phong cách
  const handleUpdatePhongCach = async () => {
    if (!editingPhongCach) return
    if (!updatedName.trim()) {
      toast.error("Vui lòng nhập tên phong cách")
      return
    }

    setIsUpdating(editingPhongCach.id)
    try {
      const response = await fetch(`/api/phongcach/${editingPhongCach.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ten_phong_cach: updatedName }),
      })

      if (response.ok) {
        toast.success("Cập nhật phong cách thành công")
        setEditDialogOpen(false)
        fetchPhongCach()
      } else {
        toast.error("Không thể cập nhật phong cách")
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi cập nhật")
    } finally {
      setIsUpdating(null)
    }
  }

  useEffect(() => {
    fetchPhongCach()
  }, [])

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" id="page-title">Quản Lý Phong Cách</h1>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          id="input-phong-cach"
          placeholder="Nhập tên phong cách mới"
          value={newPhongCach}
          onChange={(e) => setNewPhongCach(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          id="btn-them-phong-cach"
          onClick={handleAddPhongCach}
          disabled={isLoading}
        >
          {isLoading ? "Đang thêm..." : "Thêm phong cách"}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead>Tên Phong Cách</TableHead>
              <TableHead className="w-[150px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phongCachList.map((item, index) => (
              <TableRow key={item.id} id={`phong-cach-${item.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.ten_phong_cach}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      id={`btn-sua-${item.id}`}
                      onClick={() => openEditDialog(item)}
                      disabled={isUpdating === item.id}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      id={`btn-xoa-${item.id}`}
                      onClick={() => handleDeletePhongCach(item.id)}
                      disabled={isDeleting === item.id}
                      className="h-8 w-8 p-0"
                    >
                      {isDeleting === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {phongCachList.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Chưa có phong cách nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent id="dialog-sua-phong-cach">
          <DialogHeader>
            <DialogTitle>Sửa Phong Cách</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              id="input-sua-phong-cach"
              placeholder="Nhập tên phong cách"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              id="btn-huy-sua"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdatePhongCach}
              disabled={isUpdating !== null}
              id="btn-luu-sua"
            >
              {isUpdating !== null ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 