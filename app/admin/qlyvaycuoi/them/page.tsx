"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SizeCombobox } from '../components/size-combobox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Mau {
  id: number
  ten_mau: string
}

interface Size {
  id: number
  size: string
  min_chieu_cao: number
  max_chieu_cao: number
  min_can_nang: number
  max_can_nang: number
}

interface DoTuoi {
  id: number
  dotuoi: number
}

const ThemVayCuoiPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [danhSachMau, setDanhSachMau] = useState<Mau[]>([])
  const [danhSachSize, setDanhSachSize] = useState<Size[]>([])
  const [danhSachDoTuoi, setDanhSachDoTuoi] = useState<DoTuoi[]>([])
  const [urlError, setUrlError] = useState('')
  
  // State cho form thêm thuộc tính
  const [newMau, setNewMau] = useState('')
  const [newKichThuoc, setNewKichThuoc] = useState('')
  const [newDoTuoi, setNewDoTuoi] = useState('')
  const [loadingThuocTinh, setLoadingThuocTinh] = useState({
    mau: false,
    kichThuoc: false,
    doTuoi: false
  })
  
  const [formData, setFormData] = useState({
    ten: '',
    gia: '',
    anh: '',
    mau_id: '',
    size_id: '',
    do_tuoi_id: ''
  })

  const [previewImage, setPreviewImage] = useState<string>('')

  const [loadingDelete, setLoadingDelete] = useState({
    mau: {} as Record<number, boolean>,
    kichThuoc: {} as Record<number, boolean>,
    doTuoi: {} as Record<number, boolean>
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách màu
        const resMau = await fetch('/api/mau')
        const dataMau = await resMau.json()
        setDanhSachMau(dataMau.datas)
        
        // Lấy danh sách kích thước
        const resKichThuoc = await fetch('/api/size')
        const dataKichThuoc = await resKichThuoc.json()
        setDanhSachSize(dataKichThuoc.datas)
        
        // Lấy danh sách độ tuổi
        const resDoTuoi = await fetch('/api/dotuoi')
        const dataDoTuoi = await resDoTuoi.json()
        setDanhSachDoTuoi(dataDoTuoi.datas)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      }
    }

    fetchData()
  }, [])

  const validateImageUrl = async (url: string) => {
    // Danh sách các domain ảnh được tin cậy
    const trustedDomains = [
      'googleusercontent.com',
      'imgur.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'i.imgur.com',
      'drive.google.com',
      'photos.google.com',
      'storage.googleapis.com'
    ];

    // Kiểm tra nếu URL thuộc một trong các domain được tin cậy
    if (trustedDomains.some(domain => url.includes(domain))) {
      return true;
    }

    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      return contentType?.startsWith('image/');
    } catch (err) {
      // Nếu không fetch được nhưng URL có đuôi ảnh thông dụng thì vẫn chấp nhận
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
      return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Kiểm tra URL ảnh khi người dùng nhập
    if (name === 'anh') {
      if (!value) {
        setUrlError('URL ảnh không được để trống')
        setPreviewImage('') // Reset preview khi xóa URL
      } else {
        try {
          const isValidUrl = value.startsWith('http://') || value.startsWith('https://');
          if (!isValidUrl) {
            setUrlError('URL phải bắt đầu bằng http:// hoặc https://')
            setPreviewImage('') // Reset preview khi URL không hợp lệ
            return;
          }

          const isValidImageUrl = await validateImageUrl(value);
          if (!isValidImageUrl) {
            setUrlError('URL không phải là ảnh hợp lệ')
            setPreviewImage('') // Reset preview khi URL không phải ảnh
          } else {
            setUrlError('')
            setPreviewImage(value) // Cập nhật preview với URL mới
          }
        } catch (error) {
          console.error('Lỗi kiểm tra URL:', error);
          setUrlError('Không thể kiểm tra URL ảnh')
          setPreviewImage('') // Reset preview khi có lỗi
        }
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
        setFormData(prev => ({
          ...prev,
          anh: base64String
        }))
        setUrlError('') // Reset lỗi URL khi tải ảnh lên thành công
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.anh) {
      toast.error("URL ảnh không được để trống!")
      return
    }

    const isValidUrl = formData.anh.startsWith('http://') || formData.anh.startsWith('https://');
    if (!isValidUrl) {
      toast.error("URL phải bắt đầu bằng http:// hoặc https://")
      return;
    }

    try {
      const isValidImageUrl = await validateImageUrl(formData.anh);
      if (!isValidImageUrl) {
        toast.error("URL không phải là ảnh hợp lệ!")
        return
      }
    } catch (error) {
      console.error('Lỗi kiểm tra URL:', error);
      toast.error("Không thể kiểm tra URL ảnh!")
      return
    }

    setLoading(true)
    
    try {
      const dataToSubmit = {
        ...formData,
        gia: parseInt(formData.gia),
        mau_id: parseInt(formData.mau_id),
        size_id: parseInt(formData.size_id),
        do_tuoi_id: parseInt(formData.do_tuoi_id)
      }
      
      const response = await fetch('/api/vaycuoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      })
      
      if (response.ok) {
        toast.success("Thêm váy cưới thành công!")
        router.push('/admin/qlyvaycuoi')
      } else {
        const error = await response.json()
        toast.error("Có lỗi xảy ra khi thêm váy cưới!")
        console.error('Lỗi khi thêm váy cưới:', error)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi dữ liệu!")
      console.error('Lỗi khi gửi dữ liệu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMau = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMau.trim()) return
    
    setLoadingThuocTinh(prev => ({ ...prev, mau: true }))
    try {
      const response = await fetch('/api/mau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ten_mau: newMau })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Lấy lại danh sách màu mới nhất
        const resMau = await fetch('/api/mau')
        const dataMau = await resMau.json()
        setDanhSachMau(dataMau.datas)
        setNewMau('')
        toast.success('Thêm màu mới thành công!')
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi thêm màu mới!')
      }
    } catch (error) {
      console.error('Lỗi khi thêm màu:', error)
      toast.error('Có lỗi xảy ra khi thêm màu mới!')
    } finally {
      setLoadingThuocTinh(prev => ({ ...prev, mau: false }))
    }
  }

  const handleAddKichThuoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKichThuoc.trim()) return
    
    setLoadingThuocTinh(prev => ({ ...prev, kichThuoc: true }))
    try {
      const response = await fetch('/api/size', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ kich_thuoc: newKichThuoc })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Lấy lại danh sách kích thước mới nhất
        const resKichThuoc = await fetch('/api/size')
        const dataKichThuoc = await resKichThuoc.json()
        setDanhSachSize(dataKichThuoc.datas)
        setNewKichThuoc('')
        toast.success('Thêm kích thước mới thành công!')
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi thêm kích thước mới!')
      }
    } catch (error) {
      console.error('Lỗi khi thêm kích thước:', error)
      toast.error('Có lỗi xảy ra khi thêm kích thước mới!')
    } finally {
      setLoadingThuocTinh(prev => ({ ...prev, kichThuoc: false }))
    }
  }

  const handleAddDoTuoi = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDoTuoi.trim()) return
    
    setLoadingThuocTinh(prev => ({ ...prev, doTuoi: true }))
    try {
      const response = await fetch('/api/dotuoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dotuoi: parseInt(newDoTuoi) })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Lấy lại danh sách độ tuổi mới nhất
        const resDoTuoi = await fetch('/api/dotuoi')
        const dataDoTuoi = await resDoTuoi.json()
        setDanhSachDoTuoi(dataDoTuoi.datas)
        setNewDoTuoi('')
        toast.success('Thêm độ tuổi mới thành công!')
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi thêm độ tuổi mới!')
      }
    } catch (error) {
      console.error('Lỗi khi thêm độ tuổi:', error)
      toast.error('Có lỗi xảy ra khi thêm độ tuổi mới!')
    } finally {
      setLoadingThuocTinh(prev => ({ ...prev, doTuoi: false }))
    }
  }

  const handleDeleteMau = async (id: number) => {
    setLoadingDelete(prev => ({
      ...prev,
      mau: { ...prev.mau, [id]: true }
    }))
    try {
      const response = await fetch(`/api/mau/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Cập nhật danh sách màu sau khi xóa
        const resMau = await fetch('/api/mau')
        const dataMau = await resMau.json()
        setDanhSachMau(dataMau.datas)
        toast.success('Xóa màu thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi xóa màu!')
      }
    } catch (error) {
      console.error('Lỗi khi xóa màu:', error)
      toast.error('Có lỗi xảy ra khi xóa màu!')
    } finally {
      setLoadingDelete(prev => ({
        ...prev,
        mau: { ...prev.mau, [id]: false }
      }))
    }
  }

  const handleDeleteKichThuoc = async (id: number) => {
    setLoadingDelete(prev => ({
      ...prev,
      kichThuoc: { ...prev.kichThuoc, [id]: true }
    }))
    try {
      const response = await fetch(`/api/size/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Cập nhật danh sách kích thước sau khi xóa
        const resKichThuoc = await fetch('/api/size')
        const dataKichThuoc = await resKichThuoc.json()
        setDanhSachSize(dataKichThuoc.datas)
        toast.success('Xóa kích thước thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi xóa kích thước!')
      }
    } catch (error) {
      console.error('Lỗi khi xóa kích thước:', error)
      toast.error('Có lỗi xảy ra khi xóa kích thước!')
    } finally {
      setLoadingDelete(prev => ({
        ...prev,
        kichThuoc: { ...prev.kichThuoc, [id]: false }
      }))
    }
  }

  const handleDeleteDoTuoi = async (id: number) => {
    setLoadingDelete(prev => ({
      ...prev,
      doTuoi: { ...prev.doTuoi, [id]: true }
    }))
    try {
      const response = await fetch(`/api/dotuoi/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Cập nhật danh sách độ tuổi sau khi xóa
        const resDoTuoi = await fetch('/api/dotuoi')
        const dataDoTuoi = await resDoTuoi.json()
        setDanhSachDoTuoi(dataDoTuoi.datas)
        toast.success('Xóa độ tuổi thành công!')
      } else {
        toast.error('Có lỗi xảy ra khi xóa độ tuổi!')
      }
    } catch (error) {
      console.error('Lỗi khi xóa độ tuổi:', error)
      toast.error('Có lỗi xảy ra khi xóa độ tuổi!')
    } finally {
      setLoadingDelete(prev => ({
        ...prev,
        doTuoi: { ...prev.doTuoi, [id]: false }
      }))
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm váy cưới mới</h1>
        <Link href="/admin/qlyvaycuoi">
          <Button variant="outline">Quay lại</Button>
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <Label htmlFor="ten">Tên váy cưới</Label>
            <Input
              id="ten"
              name="ten"
              value={formData.ten}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gia">Giá (VNĐ)</Label>
            <Input
              id="gia"
              name="gia"
              type="number"
              value={formData.gia}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="anh">Ảnh váy cưới</Label>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Input
                  id="anh"
                  name="anh"
                  value={formData.anh}
                  onChange={handleChange}
                  placeholder="Nhập URL ảnh..."
                  className="flex-1"
                />
                <div className="relative">
                  <Input
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('upload-image')?.click()}
                  >
                    Tải ảnh lên
                  </Button>
                </div>
              </div>
              {urlError && <p className="text-red-500 text-sm">{urlError}</p>}
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Xem trước:</p>
                  <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mau_id">Màu sắc</Label>
            <select
              id="mau_id"
              name="mau_id"
              value={formData.mau_id}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Chọn màu sắc...</option>
              {danhSachMau.map((mau) => (
                <option key={mau.id} value={mau.id}>
                  {mau.ten_mau}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Kích thước</Label>
            <SizeCombobox
              sizes={danhSachSize}
              value={formData.size_id}
              onChange={(value) => setFormData(prev => ({ ...prev, size_id: value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="do_tuoi_id">Độ tuổi</Label>
            <select
              id="do_tuoi_id"
              name="do_tuoi_id"
              value={formData.do_tuoi_id}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Chọn độ tuổi...</option>
              {danhSachDoTuoi.map((doTuoi) => (
                <option key={doTuoi.id} value={doTuoi.id}>
                  {doTuoi.dotuoi} tuổi
                </option>
              ))}
            </select>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang xử lý..." : "Thêm váy cưới"}
          </Button>
        </form>
      </div>

     
    </div>
  )
}

export default ThemVayCuoiPage 