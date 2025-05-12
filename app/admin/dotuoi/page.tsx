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

interface DoTuoi {
  id: number
  dotuoi: number
  created_at: string
  updated_at: string
}

const Page = () => {
  const [danhSachDoTuoi, setDanhSachDoTuoi] = useState<DoTuoi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDoTuoi, setFilteredDoTuoi] = useState<DoTuoi[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; doTuoi: DoTuoi | null }>({
    isOpen: false,
    doTuoi: null
  })
  const [newDoTuoi, setNewDoTuoi] = useState("")
  const [editingDoTuoi, setEditingDoTuoi] = useState<DoTuoi | null>(null)

  useEffect(() => {
    if (!danhSachDoTuoi.length) return
    
    const searchTermLower = searchTerm.toLowerCase().trim()
    const filtered = danhSachDoTuoi.filter(doTuoi => {
      return (
        doTuoi.id.toString().includes(searchTermLower) ||
        doTuoi.dotuoi.toString().includes(searchTermLower)
      )
    })
    setFilteredDoTuoi(filtered)
  }, [searchTerm, danhSachDoTuoi])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dotuoi')
      const data = await response.json()
      setDanhSachDoTuoi(data.datas)
      setFilteredDoTuoi(data.datas)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error)
      toast.error("Có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newDoTuoi.trim() || isNaN(Number(newDoTuoi))) {
      toast.error("Vui lòng nhập độ tuổi hợp lệ")
      return
    }

    try {
      const response = await fetch('/api/dotuoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dotuoi: Number(newDoTuoi) }),
      })

      if (!response.ok) throw new Error('Lỗi khi thêm độ tuổi')

      toast.success("Thêm độ tuổi thành công")
      setShowAddDialog(false)
      setNewDoTuoi("")
      fetchData()
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error("Có lỗi xảy ra khi thêm độ tuổi")
    }
  }

  const handleEdit = async () => {
    if (!editingDoTuoi || isNaN(editingDoTuoi.dotuoi)) {
      toast.error("Vui lòng nhập độ tuổi hợp lệ")
      return
    }

    try {
      const response = await fetch(`/api/dotuoi/${editingDoTuoi.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dotuoi: editingDoTuoi.dotuoi }),
      })

      if (!response.ok) throw new Error('Lỗi khi cập nhật độ tuổi')

      toast.success("Cập nhật độ tuổi thành công")
      setShowEditDialog(false)
      setEditingDoTuoi(null)
      fetchData()
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error("Có lỗi xảy ra khi cập nhật độ tuổi")
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.doTuoi) return

    try {
      const response = await fetch(`/api/dotuoi/${deleteDialog.doTuoi.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Lỗi khi xóa độ tuổi')

      toast.success("Xóa độ tuổi thành công")
      setDeleteDialog({ isOpen: false, doTuoi: null })
      fetchData()
    } catch (error) {
      console.error('Lỗi:', error)
      toast.error("Có lỗi xảy ra khi xóa độ tuổi")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý độ tuổi</h1>
        <Button 
          id="btn-them-do-tuoi" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddDialog(true)}
        >
          Thêm độ tuổi mới
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            id="search-do-tuoi"
            type="text"
            placeholder="Tìm kiếm theo ID, độ tuổi..."
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
          <table id="table-do-tuoi" className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độ tuổi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoTuoi.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredDoTuoi.map((doTuoi) => (
                  <tr key={doTuoi.id} id={`do-tuoi-${doTuoi.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doTuoi.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doTuoi.dotuoi} tuổi</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        id={`btn-sua-${doTuoi.id}`}
                        onClick={() => {
                          setEditingDoTuoi(doTuoi)
                          setShowEditDialog(true)
                        }}
                      >
                        Sửa
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        id={`btn-xoa-${doTuoi.id}`}
                        onClick={() => setDeleteDialog({ isOpen: true, doTuoi })}
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

      {/* Dialog thêm độ tuổi mới */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm độ tuổi mới</DialogTitle>
            <DialogDescription>
              Nhập độ tuổi mới vào ô bên dưới
            </DialogDescription>
          </DialogHeader>
          <Input
            id="input-do-tuoi-moi"
            type="number"
            placeholder="Nhập độ tuổi..."
            value={newDoTuoi}
            onChange={(e) => setNewDoTuoi(e.target.value)}
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

      {/* Dialog chỉnh sửa độ tuổi */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa độ tuổi</DialogTitle>
            <DialogDescription>
              Chỉnh sửa độ tuổi trong ô bên dưới
            </DialogDescription>
          </DialogHeader>
          <Input
            id="input-do-tuoi-sua"
            type="number"
            placeholder="Nhập độ tuổi..."
            value={editingDoTuoi?.dotuoi || ""}
            onChange={(e) => setEditingDoTuoi(prev => prev ? {...prev, dotuoi: Number(e.target.value)} : null)}
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
      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteDialog({ isOpen: false, doTuoi: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa độ tuổi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa độ tuổi "{deleteDialog.doTuoi?.dotuoi} tuổi" không? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, doTuoi: null })}
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