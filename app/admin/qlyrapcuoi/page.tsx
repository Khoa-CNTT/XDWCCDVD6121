"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { toast } from "sonner";

interface RapCuoi {
  id: number;
  ten_rap: string;
  mau_id: number;
  so_ghe_id: number;
  so_day_ghe_id: number;
  gia_thue: number;
  anh_rap: string;
}

interface Mau {
  id: number;
  ten_mau: string;
}

interface SoGhe {
  id: number;
  so_luong_ghe: number;
}

interface SoDayGhe {
  id: number;
  so_luong_day_ghe: number;
}

export default function QuanLyRapCuoi() {
  const [rapCuois, setRapCuois] = useState<RapCuoi[]>([]);
  const [mauList, setMauList] = useState<Mau[]>([]);
  const [soGheList, setSoGheList] = useState<SoGhe[]>([]);
  const [soDayGheList, setSoDayGheList] = useState<SoDayGhe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    ten_rap: "",
    mau_id: 0,
    so_ghe_id: 0,
    so_day_ghe_id: 0,
    gia_thue: 0,
    anh_rap: "",
  });

  useEffect(() => {
    fetchRapCuois();
    fetchMauList();
    fetchSoGheList();
    fetchSoDayGheList();
  }, []);

  const fetchRapCuois = async () => {
    try {
      const response = await fetch("/api/rapcuoi");
      const data = await response.json();
      setRapCuois(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu rạp cưới:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu rạp cưới");
    }
  };

  const fetchMauList = async () => {
    try {
      const response = await fetch("/api/mau");
      const data = await response.json();
      setMauList(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu mã màu:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu mã màu");
    }
  };

  const fetchSoGheList = async () => {
    try {
      const response = await fetch("/api/soghe");
      const data = await response.json();
      setSoGheList(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số ghế:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu số ghế");
    }
  };

  const fetchSoDayGheList = async () => {
    try {
      const response = await fetch("/api/sodayghe");
      const data = await response.json();
      setSoDayGheList(data.datas);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số dãy ghế:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu số dãy ghế");
    }
  };

  const handleEdit = (rapCuoi: RapCuoi) => {
    setIsEditMode(true);
    setEditingId(rapCuoi.id);
    setFormData({
      ten_rap: rapCuoi.ten_rap,
      mau_id: rapCuoi.mau_id,
      so_ghe_id: rapCuoi.so_ghe_id,
      so_day_ghe_id: rapCuoi.so_day_ghe_id,
      gia_thue: rapCuoi.gia_thue,
      anh_rap: rapCuoi.anh_rap,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa rạp cưới này?")) {
      try {
        const response = await fetch(`/api/rapcuoi/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Xóa rạp cưới thành công");
          fetchRapCuois();
        } else {
          toast.error("Không thể xóa rạp cưới");
        }
      } catch (error) {
        console.error("Lỗi khi xóa rạp cưới:", error);
        toast.error("Có lỗi xảy ra khi xóa rạp cưới");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingId) {
        const response = await fetch(`/api/rapcuoi/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Cập nhật rạp cưới thành công");
          setIsOpen(false);
          setIsEditMode(false);
          setEditingId(null);
          fetchRapCuois();
          setFormData({
            ten_rap: "",
            mau_id: 0,
            so_ghe_id: 0,
            so_day_ghe_id: 0,
            gia_thue: 0,
            anh_rap: "",
          });
        } else {
          toast.error("Không thể cập nhật rạp cưới");
        }
      } else {
        const response = await fetch("/api/rapcuoi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Thêm rạp cưới thành công");
          setIsOpen(false);
          fetchRapCuois();
          setFormData({
            ten_rap: "",
            mau_id: 0,
            so_ghe_id: 0,
            so_day_ghe_id: 0,
            gia_thue: 0,
            anh_rap: "",
          });
        } else {
          toast.error("Không thể thêm rạp cưới");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm/sửa rạp cưới:", error);
      toast.error("Có lỗi xảy ra khi thêm/sửa rạp cưới");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 id="page-title" className="text-3xl font-bold">
          Quản Lý Rạp Cưới
        </h1>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setIsEditMode(false);
              setEditingId(null);
              setFormData({
                ten_rap: "",
                mau_id: 0,
                so_ghe_id: 0,
                so_day_ghe_id: 0,
                gia_thue: 0,
                anh_rap: "",
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button id="btn-them-moi" variant="default">
              Thêm Rạp Cưới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Sửa Rạp Cưới" : "Thêm Rạp Cưới Mới"}
              </DialogTitle>
            </DialogHeader>
            <form
              id="form-them-rap"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="ten_rap">Tên Rạp</Label>
                <Input
                  id="ten_rap"
                  value={formData.ten_rap}
                  onChange={(e) =>
                    setFormData({ ...formData, ten_rap: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="mau_id">Mã Màu</Label>
                <Select
                  value={formData.mau_id.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mau_id: parseInt(value) })
                  }
                >
                  <SelectTrigger id="mau_id">
                    <SelectValue placeholder="Chọn mã màu" />
                  </SelectTrigger>
                  <SelectContent>
                    {mauList.map((mau) => (
                      <SelectItem key={mau.id} value={mau.id.toString()}>
                        {mau.ten_mau}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="so_ghe_id">Số Ghế</Label>
                <Select
                  value={formData.so_ghe_id.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, so_ghe_id: parseInt(value) })
                  }
                >
                  <SelectTrigger id="so_ghe_id">
                    <SelectValue placeholder="Chọn số ghế" />
                  </SelectTrigger>
                  <SelectContent>
                    {soGheList.map((soGhe) => (
                      <SelectItem key={soGhe.id} value={soGhe.id.toString()}>
                        {soGhe.so_luong_ghe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="so_day_ghe_id">Số Dãy Ghế</Label>
                <Select
                  value={formData.so_day_ghe_id.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, so_day_ghe_id: parseInt(value) })
                  }
                >
                  <SelectTrigger id="so_day_ghe_id">
                    <SelectValue placeholder="Chọn số dãy ghế" />
                  </SelectTrigger>
                  <SelectContent>
                    {soDayGheList.map((soDayGhe) => (
                      <SelectItem
                        key={soDayGhe.id}
                        value={soDayGhe.id.toString()}
                      >
                        {soDayGhe.so_luong_day_ghe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="gia_thue">Giá Thuê</Label>
                <Input
                  id="gia_thue"
                  type="number"
                  value={formData.gia_thue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gia_thue: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="anh_rap">Link Ảnh</Label>
                <Input
                  id="anh_rap"
                  value={formData.anh_rap}
                  onChange={(e) =>
                    setFormData({ ...formData, anh_rap: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isEditMode ? "Cập Nhật" : "Thêm Mới"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên Rạp</TableHead>
              <TableHead>Mã Màu</TableHead>
              <TableHead>Số Ghế</TableHead>
              <TableHead>Số Dãy Ghế</TableHead>
              <TableHead>Giá Thuê</TableHead>
              <TableHead>Hình Ảnh</TableHead>
              <TableHead>Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rapCuois.map((rapCuoi) => (
              <TableRow key={rapCuoi.id}>
                <TableCell>{rapCuoi.id}</TableCell>
                <TableCell>{rapCuoi.ten_rap}</TableCell>
                <TableCell>
                  {mauList.find((m) => m.id === rapCuoi.mau_id)?.ten_mau}
                </TableCell>
                <TableCell>
                  {
                    soGheList.find((g) => g.id === rapCuoi.so_ghe_id)
                      ?.so_luong_ghe
                  }
                </TableCell>
                <TableCell>
                  {
                    soDayGheList.find((d) => d.id === rapCuoi.so_day_ghe_id)
                      ?.so_luong_day_ghe
                  }
                </TableCell>
                <TableCell>{rapCuoi.gia_thue.toLocaleString()} VNĐ</TableCell>
                <TableCell>
                  {rapCuoi.anh_rap && (
                    <Image
                      src={rapCuoi.anh_rap}
                      alt={rapCuoi.ten_rap}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      id={`btn-sua-${rapCuoi.id}`}
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rapCuoi)}
                    >
                      Sửa
                    </Button>
                    <Button
                      id={`btn-xoa-${rapCuoi.id}`}
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(rapCuoi.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
