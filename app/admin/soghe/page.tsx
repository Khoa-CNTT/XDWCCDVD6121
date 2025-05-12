"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface SoGhe {
  id: number
  so_luong_ghe: number
  created_at: string
  updated_at: string
}

const formSchema = z.object({
  so_luong_ghe: z.coerce.number().positive({
    message: "Số lượng ghế phải là số dương",
  }),
})

type FormSchema = z.infer<typeof formSchema>

const Page = () => {
  const [danhSachSoGhe, setDanhSachSoGhe] = useState<SoGhe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSoGhe, setFilteredSoGhe] = useState<SoGhe[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; item: SoGhe | null }>({
    isOpen: false,
    item: null
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SoGhe | null>(null)

  const addForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      so_luong_ghe: 0,
    },
  })

  const editForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      so_luong_ghe: 0,
    },
  })

  useEffect(() => {
    if (!danhSachSoGhe.length) return
    
    const searchTermLower = searchTerm.toLowerCase().trim()
    const filtered = danhSachSoGhe.filter(item => {
      return (
        item.id.toString().includes(searchTermLower) ||
        item.so_luong_ghe.toString().includes(searchTermLower)
      )
    })
    setFilteredSoGhe(filtered)
  }, [searchTerm, danhSachSoGhe])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/soghe')
        const data = await response.json()

        setDanhSachSoGhe(data.datas)
        setFilteredSoGhe(data.datas)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
        toast.error("Có lỗi xảy ra khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = (item: SoGhe) => {
    setDeleteDialog({ isOpen: true, item })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.item) return

    try {
      const response = await fetch(`/api/soghe/${deleteDialog.item.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xóa số ghế')
      }

      setDanhSachSoGhe(prev => prev.filter(item => item.id !== deleteDialog.item?.id))
      setFilteredSoGhe(prev => prev.filter(item => item.id !== deleteDialog.item?.id))
      toast.success("Xóa số ghế thành công")
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      toast.error("Có lỗi xảy ra khi xóa số ghế")
    } finally {
      setDeleteDialog({ isOpen: false, item: null })
    }
  }

  const handleAdd = async (values: FormSchema) => {
    try {
      const response = await fetch('/api/soghe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Lỗi khi thêm số ghế')
      }

      const data = await response.json()
      setDanhSachSoGhe(prev => [...prev, data.datas])
      setFilteredSoGhe(prev => [...prev, data.datas])
      toast.success("Thêm số ghế thành công")
      setIsAddDialogOpen(false)
      addForm.reset()
    } catch (error) {
      console.error('Lỗi khi thêm:', error)
      toast.error("Có lỗi xảy ra khi thêm số ghế")
    }
  }

  const openEditDialog = (item: SoGhe) => {
    setSelectedItem(item)
    editForm.setValue("so_luong_ghe", item.so_luong_ghe)
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (values: FormSchema) => {
    if (!selectedItem) return

    try {
      const response = await fetch(`/api/soghe/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật số ghế')
      }

      const data = await response.json()
      setDanhSachSoGhe(prev => 
        prev.map(item => item.id === selectedItem.id ? data.data : item)
      )
      setFilteredSoGhe(prev => 
        prev.map(item => item.id === selectedItem.id ? data.data : item)
      )
      toast.success("Cập nhật số ghế thành công")
      setIsEditDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error)
      toast.error("Có lỗi xảy ra khi cập nhật số ghế")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý số ghế</h1>
        <Button 
          id="btn-them-so-ghe"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            addForm.reset()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm số ghế mới
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            id="search-so-ghe"
            type="text"
            placeholder="Tìm kiếm theo ID, số lượng ghế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoGhe.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Không có dữ liệu số ghế
            </div>
          ) : (
            filteredSoGhe.map((item) => (
              <Card key={item.id} id={`so-ghe-${item.id}`} className="border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Số ghế ID: {item.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số lượng ghế:</span>
                      <span className="font-medium">{item.so_luong_ghe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="font-medium">{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cập nhật lần cuối:</span>
                      <span className="font-medium">{new Date(item.updated_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button 
                    id={`btn-sua-${item.id}`}
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    id={`btn-xoa-${item.id}`}
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Xóa
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setDeleteDialog({ isOpen: false, item: null });
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa số ghế này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
            <Button 
              id="btn-huy-xoa"
              variant="outline" 
              onClick={() => setDeleteDialog({ isOpen: false, item: null })}
            >
              Hủy
            </Button>
            <Button 
              id="btn-xac-nhan-xoa"
              variant="destructive" 
              onClick={confirmDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm số ghế mới</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-6">
              <FormField
                control={addForm.control}
                name="so_luong_ghe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng ghế</FormLabel>
                    <FormControl>
                      <Input 
                        id="input-so-luong-ghe"
                        type="number" 
                        placeholder="Nhập số lượng ghế" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  id="btn-huy-them"
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  id="btn-xac-nhan-them"
                  type="submit"
                >
                  Thêm mới
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa số ghế</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="so_luong_ghe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng ghế</FormLabel>
                    <FormControl>
                      <Input 
                        id="input-edit-so-luong-ghe"
                        type="number" 
                        placeholder="Nhập số lượng ghế" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  id="btn-huy-sua"
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  id="btn-xac-nhan-sua"
                  type="submit"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page 