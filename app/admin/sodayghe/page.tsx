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

interface SoDayGhe {
  id: number
  so_luong_day_ghe: number
  created_at: string
  updated_at: string
}

const formSchema = z.object({
  so_luong_day_ghe: z.coerce.number().positive({
    message: "Số lượng dãy ghế phải là số dương",
  }),
})

type FormSchema = z.infer<typeof formSchema>

const Page = () => {
  const [danhSachSoDayGhe, setDanhSachSoDayGhe] = useState<SoDayGhe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSoDayGhe, setFilteredSoDayGhe] = useState<SoDayGhe[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; item: SoDayGhe | null }>({
    isOpen: false,
    item: null
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SoDayGhe | null>(null)

  const addForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      so_luong_day_ghe: 0,
    },
  })

  const editForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      so_luong_day_ghe: 0,
    },
  })

  useEffect(() => {
    if (!danhSachSoDayGhe.length) return
    
    const searchTermLower = searchTerm.toLowerCase().trim()
    const filtered = danhSachSoDayGhe.filter(item => {
      return (
        item.id.toString().includes(searchTermLower) ||
        item.so_luong_day_ghe.toString().includes(searchTermLower)
      )
    })
    setFilteredSoDayGhe(filtered)
  }, [searchTerm, danhSachSoDayGhe])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sodayghe')
        const data = await response.json()

        setDanhSachSoDayGhe(data.datas)
        setFilteredSoDayGhe(data.datas)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
        toast.error("Có lỗi xảy ra khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = (item: SoDayGhe) => {
    setDeleteDialog({ isOpen: true, item })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.item) return

    try {
      const response = await fetch(`/api/sodayghe/${deleteDialog.item.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xóa số dãy ghế')
      }

      setDanhSachSoDayGhe(prev => prev.filter(item => item.id !== deleteDialog.item?.id))
      setFilteredSoDayGhe(prev => prev.filter(item => item.id !== deleteDialog.item?.id))
      toast.success("Xóa số dãy ghế thành công")
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      toast.error("Có lỗi xảy ra khi xóa số dãy ghế")
    } finally {
      setDeleteDialog({ isOpen: false, item: null })
    }
  }

  const handleAdd = async (values: FormSchema) => {
    try {
      const response = await fetch('/api/sodayghe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Lỗi khi thêm số dãy ghế')
      }

      const data = await response.json()
      setDanhSachSoDayGhe(prev => [...prev, data.datas])
      setFilteredSoDayGhe(prev => [...prev, data.datas])
      toast.success("Thêm số dãy ghế thành công")
      setIsAddDialogOpen(false)
      addForm.reset()
    } catch (error) {
      console.error('Lỗi khi thêm:', error)
      toast.error("Có lỗi xảy ra khi thêm số dãy ghế")
    }
  }

  const openEditDialog = (item: SoDayGhe) => {
    setSelectedItem(item)
    editForm.setValue("so_luong_day_ghe", item.so_luong_day_ghe)
    setIsEditDialogOpen(true)
  }

  const handleEdit = async (values: FormSchema) => {
    if (!selectedItem) return

    try {
      const response = await fetch(`/api/sodayghe/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật số dãy ghế')
      }

      const data = await response.json()
      setDanhSachSoDayGhe(prev => 
        prev.map(item => item.id === selectedItem.id ? data.data : item)
      )
      setFilteredSoDayGhe(prev => 
        prev.map(item => item.id === selectedItem.id ? data.data : item)
      )
      toast.success("Cập nhật số dãy ghế thành công")
      setIsEditDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error)
      toast.error("Có lỗi xảy ra khi cập nhật số dãy ghế")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý số dãy ghế</h1>
        <Button 
          id="btn-them-day-ghe"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            addForm.reset()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm số dãy ghế mới
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            id="search-day-ghe"
            type="text"
            placeholder="Tìm kiếm theo ID, số lượng dãy ghế..."
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
          {filteredSoDayGhe.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Không có dữ liệu số dãy ghế
            </div>
          ) : (
            filteredSoDayGhe.map((item) => (
              <Card key={item.id} id={`day-ghe-${item.id}`} className="border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Số dãy ghế ID: {item.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-3xl font-bold text-blue-600 text-center py-6">
                    {item.so_luong_day_ghe} dãy
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    id={`btn-sua-${item.id}`}
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Sửa
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    id={`btn-xoa-${item.id}`}
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteDialog({ isOpen: false, item: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa số dãy ghế</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa số dãy ghế {deleteDialog.item?.so_luong_day_ghe} (ID: {deleteDialog.item?.id}) không? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, item: null })}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm số dãy ghế */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm số dãy ghế mới</DialogTitle>
            <DialogDescription>
              Nhập số lượng dãy ghế để thêm mới
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="so_luong_day_ghe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng dãy ghế</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số lượng dãy ghế"
                        id="add-so-luong-day-ghe"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập số lượng dãy ghế cho rạp cưới
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" id="btn-save-new-day-ghe">Lưu</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog sửa số dãy ghế */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa số dãy ghế</DialogTitle>
            <DialogDescription>
              Chỉnh sửa số lượng dãy ghế (ID: {selectedItem?.id})
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="so_luong_day_ghe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng dãy ghế</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số lượng dãy ghế"
                        id="edit-so-luong-day-ghe"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cập nhật số lượng dãy ghế cho rạp cưới
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" id="btn-update-day-ghe">Cập nhật</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page 