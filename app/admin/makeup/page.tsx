"use client"

import { useState, useEffect, useRef } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pencil, Trash2, Plus, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

interface MakeUp {
  id: number
  ten_makeup: string
  gia_makeup: number
  phong_cach_id: number
  anh_makeup: string
  chi_tiet: string
  phong_cach_relation?: {
    ten_phong_cach: string
  }
}

interface PhongCach {
  id: number
  ten_phong_cach: string
}

export default function MakeupPage() {
  const [makeupList, setMakeupList] = useState<MakeUp[]>([])
  const [phongCachList, setPhongCachList] = useState<PhongCach[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentMakeup, setCurrentMakeup] = useState<MakeUp | null>(null)
  const [urlError, setUrlError] = useState("")
  
  // Form states
  const [tenMakeup, setTenMakeup] = useState("")
  const [giaMakeup, setGiaMakeup] = useState("")
  const [phongCachId, setPhongCachId] = useState("")
  const [anhMakeup, setAnhMakeup] = useState("")
  const [chiTiet, setChiTiet] = useState("")

  // Refs for file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch makeup data
      const makeupResponse = await fetch("/api/makeup")
      const makeupData = await makeupResponse.json()
      
      // Fetch phong cách data
      const phongCachResponse = await fetch("/api/phongcach")
      const phongCachData = await phongCachResponse.json()
      
      // Get detailed makeup with phong cách name
      const detailedMakeup = await Promise.all(
        makeupData.datas.map(async (makeup: MakeUp) => {
          const phongCach = phongCachData.datas.find(
            (pc: PhongCach) => pc.id === makeup.phong_cach_id
          )
          return {
            ...makeup,
            phong_cach_relation: phongCach ? { ten_phong_cach: phongCach.ten_phong_cach } : undefined
          }
        })
      )

      setMakeupList(detailedMakeup)
      setPhongCachList(phongCachData.datas)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error)
      toast.error("Không thể tải dữ liệu makeup!")
    } finally {
      setLoading(false)
    }
  }

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

  const handleImageUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAnhMakeup(value);

    // Kiểm tra URL ảnh khi người dùng nhập
    if (!value) {
      setUrlError('URL ảnh không được để trống');
    } else {
      try {
        const isValidUrl = value.startsWith('http://') || value.startsWith('https://');
        if (!isValidUrl) {
          setUrlError('URL phải bắt đầu bằng http:// hoặc https://');
          return;
        }

        const isValidImageUrl = await validateImageUrl(value);
        if (!isValidImageUrl) {
          setUrlError('URL không phải là ảnh hợp lệ');
        } else {
          setUrlError('');
        }
      } catch (error) {
        console.error('Lỗi kiểm tra URL:', error);
        setUrlError('Không thể kiểm tra URL ảnh');
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const handleAddMakeup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tenMakeup || !giaMakeup || !phongCachId || !anhMakeup || !chiTiet) {
      toast.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    // Kiểm tra URL ảnh
    const isValidUrl = anhMakeup.startsWith('http://') || anhMakeup.startsWith('https://');
    if (!isValidUrl) {
      toast.error("URL phải bắt đầu bằng http:// hoặc https://");
      return;
    }

    try {
      const isValidImageUrl = await validateImageUrl(anhMakeup);
      if (!isValidImageUrl) {
        toast.error("URL không phải là ảnh hợp lệ!");
        return;
      }
    } catch (error) {
      console.error('Lỗi kiểm tra URL:', error);
      toast.error("Không thể kiểm tra URL ảnh!");
      return;
    }

    setSubmitting(true)
    
    try {
      const response = await fetch("/api/makeup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_makeup: tenMakeup,
          gia_makeup: parseInt(giaMakeup),
          phong_cach_id: parseInt(phongCachId),
          anh_makeup: anhMakeup,
          chi_tiet: chiTiet,
        }),
      })

      if (response.ok) {
        toast.success("Thêm dịch vụ makeup thành công!")
        setOpenAddDialog(false)
        resetForm()
        fetchData()
      } else {
        toast.error("Không thể thêm dịch vụ makeup!")
      }
    } catch (error) {
      console.error("Lỗi khi thêm makeup:", error)
      toast.error("Đã xảy ra lỗi khi thêm dịch vụ makeup!")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateMakeup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentMakeup) return
    
    if (!tenMakeup || !giaMakeup || !phongCachId || !anhMakeup || !chiTiet) {
      toast.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    // Kiểm tra URL ảnh
    const isValidUrl = anhMakeup.startsWith('http://') || anhMakeup.startsWith('https://');
    if (!isValidUrl) {
      toast.error("URL phải bắt đầu bằng http:// hoặc https://");
      return;
    }

    try {
      const isValidImageUrl = await validateImageUrl(anhMakeup);
      if (!isValidImageUrl) {
        toast.error("URL không phải là ảnh hợp lệ!");
        return;
      }
    } catch (error) {
      console.error('Lỗi kiểm tra URL:', error);
      toast.error("Không thể kiểm tra URL ảnh!");
      return;
    }

    setSubmitting(true)
    
    try {
      const response = await fetch(`/api/makeup/${currentMakeup.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_makeup: tenMakeup,
          gia_makeup: parseInt(giaMakeup),
          phong_cach_id: parseInt(phongCachId),
          anh_makeup: anhMakeup,
          chi_tiet: chiTiet,
        }),
      })

      if (response.ok) {
        toast.success("Cập nhật dịch vụ makeup thành công!")
        setOpenEditDialog(false)
        resetForm()
        fetchData()
      } else {
        toast.error("Không thể cập nhật dịch vụ makeup!")
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật makeup:", error)
      toast.error("Đã xảy ra lỗi khi cập nhật dịch vụ makeup!")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteMakeup = async () => {
    if (!currentMakeup) return
    
    setSubmitting(true)
    
    try {
      const response = await fetch(`/api/makeup/${currentMakeup.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Xóa dịch vụ makeup thành công!")
        setOpenDeleteDialog(false)
        setCurrentMakeup(null)
        fetchData()
      } else {
        toast.error("Không thể xóa dịch vụ makeup!")
      }
    } catch (error) {
      console.error("Lỗi khi xóa makeup:", error)
      toast.error("Đã xảy ra lỗi khi xóa dịch vụ makeup!")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setTenMakeup("")
    setGiaMakeup("")
    setPhongCachId("")
    setAnhMakeup("")
    setChiTiet("")
    setUrlError("")
  }

  const openEditMode = (makeup: MakeUp) => {
    setCurrentMakeup(makeup)
    setTenMakeup(makeup.ten_makeup)
    setGiaMakeup(makeup.gia_makeup.toString())
    setPhongCachId(makeup.phong_cach_id.toString())
    setAnhMakeup(makeup.anh_makeup)
    setChiTiet(makeup.chi_tiet)
    setUrlError("")
    setOpenEditDialog(true)
  }

  const openDeleteMode = (makeup: MakeUp) => {
    setCurrentMakeup(makeup)
    setOpenDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" id="makeup-title">Quản lý dịch vụ Makeup</h1>
        
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button id="add-makeup-button" variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm dịch vụ Makeup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ Makeup mới</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAddMakeup} id="add-makeup-form" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="ten_makeup" className="font-medium">Tên dịch vụ Makeup</label>
                  <Input
                    id="ten_makeup"
                    value={tenMakeup}
                    onChange={(e) => setTenMakeup(e.target.value)}
                    placeholder="Nhập tên dịch vụ makeup"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="gia_makeup" className="font-medium">Giá dịch vụ (VNĐ)</label>
                  <Input
                    id="gia_makeup"
                    type="number"
                    value={giaMakeup}
                    onChange={(e) => setGiaMakeup(e.target.value)}
                    placeholder="Nhập giá dịch vụ"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phong_cach_id" className="font-medium">Phong cách</label>
                  <Select
                    value={phongCachId}
                    onValueChange={setPhongCachId}
                  >
                    <SelectTrigger id="phong_cach_id">
                      <SelectValue placeholder="Chọn phong cách makeup" />
                    </SelectTrigger>
                    <SelectContent>
                      {phongCachList.map((phongCach) => (
                        <SelectItem key={phongCach.id} value={phongCach.id.toString()}>
                          {phongCach.ten_phong_cach}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="anh_makeup" className="font-medium">Đường dẫn ảnh</label>
                  <Input
                    id="anh_makeup"
                    value={anhMakeup}
                    onChange={handleImageUrlChange}
                    placeholder="Nhập đường dẫn ảnh makeup"
                    required
                    className={urlError ? "border-red-500" : ""}
                  />
                  {urlError && (
                    <div className="flex items-center mt-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {urlError}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="chi_tiet" className="font-medium">Chi tiết dịch vụ</label>
                <Textarea
                  id="chi_tiet"
                  value={chiTiet}
                  onChange={(e) => setChiTiet(e.target.value)}
                  placeholder="Mô tả chi tiết về dịch vụ makeup"
                  rows={5}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm()
                    setOpenAddDialog(false)
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting || !!urlError}
                  id="confirm-add-button"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Thêm dịch vụ"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa dịch vụ Makeup</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleUpdateMakeup} id="edit-makeup-form" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit_ten_makeup" className="font-medium">Tên dịch vụ Makeup</label>
                  <Input
                    id="edit_ten_makeup"
                    value={tenMakeup}
                    onChange={(e) => setTenMakeup(e.target.value)}
                    placeholder="Nhập tên dịch vụ makeup"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit_gia_makeup" className="font-medium">Giá dịch vụ (VNĐ)</label>
                  <Input
                    id="edit_gia_makeup"
                    type="number"
                    value={giaMakeup}
                    onChange={(e) => setGiaMakeup(e.target.value)}
                    placeholder="Nhập giá dịch vụ"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit_phong_cach_id" className="font-medium">Phong cách</label>
                  <Select
                    value={phongCachId}
                    onValueChange={setPhongCachId}
                  >
                    <SelectTrigger id="edit_phong_cach_id">
                      <SelectValue placeholder="Chọn phong cách makeup" />
                    </SelectTrigger>
                    <SelectContent>
                      {phongCachList.map((phongCach) => (
                        <SelectItem key={phongCach.id} value={phongCach.id.toString()}>
                          {phongCach.ten_phong_cach}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit_anh_makeup" className="font-medium">Đường dẫn ảnh</label>
                  <Input
                    id="edit_anh_makeup"
                    value={anhMakeup}
                    onChange={handleImageUrlChange}
                    placeholder="Nhập đường dẫn ảnh makeup"
                    required
                    className={urlError ? "border-red-500" : ""}
                  />
                  {urlError && (
                    <div className="flex items-center mt-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {urlError}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit_chi_tiet" className="font-medium">Chi tiết dịch vụ</label>
                <Textarea
                  id="edit_chi_tiet"
                  value={chiTiet}
                  onChange={(e) => setChiTiet(e.target.value)}
                  placeholder="Mô tả chi tiết về dịch vụ makeup"
                  rows={5}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm()
                    setOpenEditDialog(false)
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting || !!urlError}
                  id="confirm-edit-button"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Dialog */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa dịch vụ Makeup</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Bạn có chắc chắn muốn xóa dịch vụ "{currentMakeup?.ten_makeup}"?</p>
              <p className="text-gray-500 mt-1">Hành động này không thể hoàn tác.</p>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDeleteDialog(false)}
              >
                Hủy
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDeleteMakeup}
                disabled={submitting}
                id="confirm-delete-button"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xóa dịch vụ"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {makeupList.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Chưa có dịch vụ Makeup nào</h3>
              <p className="mt-1 text-sm text-gray-500">Bắt đầu thêm dịch vụ makeup mới.</p>
              <div className="mt-6">
                <Button 
                  onClick={() => setOpenAddDialog(true)}
                  id="empty-add-button"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm dịch vụ Makeup
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {makeupList.map((makeup) => (
                <Card key={makeup.id} id={`makeup-card-${makeup.id}`} className="overflow-hidden">
                  <div className="aspect-square relative">
                    {makeup.anh_makeup && (
                      <Image
                        src={makeup.anh_makeup}
                        alt={makeup.ten_makeup}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{makeup.ten_makeup}</CardTitle>
                    <CardDescription>
                      Phong cách: {makeup.phong_cach_relation?.ten_phong_cach || "Không xác định"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(makeup.gia_makeup)}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {makeup.chi_tiet}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t p-4 gap-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditMode(makeup)}
                      id={`edit-button-${makeup.id}`}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Sửa
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteMode(makeup)}
                      id={`delete-button-${makeup.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
} 