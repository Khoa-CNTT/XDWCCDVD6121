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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Search } from "lucide-react"

interface Mau {
  id: number
  ten_mau: string
  created_at: string
  updated_at: string
}

const Page = () => {
  const [danhSachMau, setDanhSachMau] = useState<Mau[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMau, setFilteredMau] = useState<Mau[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; mau: Mau | null }>({
    isOpen: false,
    mau: null
  })
  const [newMau, setNewMau] = useState("")
  const [editingMau, setEditingMau] = useState<Mau | null>(null)

  useEffect(() => {
    if (!danhSachMau.length) return
    
    const searchTermLower = searchTerm.toLowerCase().trim()
    const filtered = danhSachMau.filter(mau => {
      return (
        mau.id.toString().includes(searchTermLower) ||
        mau.ten_mau.toLowerCase().includes(searchTermLower)
      )
    })
    setFilteredMau(filtered)
  }, [searchTerm, danhSachMau])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/mau')
      const data = await response.json()
      setDanhSachMau(data.datas)
      setFilteredMau(data.datas)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error)
      toast.error("Có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newMau.trim()) {
      toast.error("Vui lòng nhập tên màu")
      return
    }

    try {
      const response = await fetch('/api/mau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ten_mau: newMau.trim() }),
      })

      if (!response.ok) throw new Error('Lỗi khi thêm màu')

      toast.success("Thêm màu thành công")
      setShowAddDialog(false)
      setNewMau("")
      fetchData()
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error("Có lỗi xảy ra khi thêm màu")
    }
  }

  const handleEdit = async () => {
    if (!editingMau || !editingMau.ten_mau.trim()) {
      toast.error("Vui lòng nhập tên màu")
      return
    }

    try {
      const response = await fetch(`/api/mau/${editingMau.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ten_mau: editingMau.ten_mau.trim() }),
      })

      if (!response.ok) throw new Error('Lỗi khi cập nhật màu')

      toast.success("Cập nhật màu thành công")
      setShowEditDialog(false)
      setEditingMau(null)
      fetchData()
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error("Có lỗi xảy ra khi cập nhật màu")
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.mau) return

    try {
      const response = await fetch(`/api/mau/${deleteDialog.mau.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Lỗi khi xóa màu')

      toast.success("Xóa màu thành công")
      setDeleteDialog({ isOpen: false, mau: null })
      fetchData()
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error("Có lỗi xảy ra khi xóa màu")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý màu sắc</h1>
        <Button 
          id="btn-them-mau" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddDialog(true)}
        >
          Thêm màu mới
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            id="search-mau"
            type="text"
            placeholder="Tìm kiếm theo ID, tên màu..."
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
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table id="table-mau" className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên màu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMau.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredMau.map((mau) => (
                  <tr key={mau.id} id={`mau-${mau.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mau.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mau.ten_mau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        id={`btn-sua-${mau.id}`}
                        onClick={() => {
                          setEditingMau(mau)
                          setShowEditDialog(true)
                        }}
                      >
                        Sửa
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        id={`btn-xoa-${mau.id}`}
                        onClick={() => setDeleteDialog({ isOpen: true, mau })}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog thêm màu mới */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm màu mới</DialogTitle>
            <DialogDescription>
              Nhập tên màu mới vào ô bên dưới
            </DialogDescription>
          </DialogHeader>
          <Input
            id="input-ten-mau-moi"
            placeholder="Nhập tên màu..."
            value={newMau}
            onChange={(e) => setNewMau(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAdd}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa màu */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa màu</DialogTitle>
            <DialogDescription>
              Chỉnh sửa tên màu trong ô bên dưới
            </DialogDescription>
          </DialogHeader>
          <Input
            id="input-ten-mau-sua"
            placeholder="Nhập tên màu..."
            value={editingMau?.ten_mau || ""}
            onChange={(e) => setEditingMau(prev => prev ? {...prev, ten_mau: e.target.value} : null)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteDialog({ isOpen: false, mau: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa màu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa màu "{deleteDialog.mau?.ten_mau}" không? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, mau: null })}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page 