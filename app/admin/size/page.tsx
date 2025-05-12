"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Size {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

export default function SizePage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    size: "",
    min_chieu_cao: 0,
    max_chieu_cao: 0,
    min_can_nang: 0,
    max_can_nang: 0,
  });

  const fetchSizes = async () => {
    try {
      const response = await fetch("/api/size");
      const data = await response.json();
      setSizes(data.datas);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/size", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Thêm size thành công");
        fetchSizes();
        setFormData({
          size: "",
          min_chieu_cao: 0,
          max_chieu_cao: 0,
          min_can_nang: 0,
          max_can_nang: 0,
        });
      }
    } catch (error) {
      toast.error("Lỗi khi thêm size");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        const response = await fetch(`/api/size/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Xóa size thành công");
          fetchSizes();
        }
      } catch (error) {
        toast.error("Lỗi khi xóa size");
      }
    }
  };

  const handleEdit = async (id: number) => {
    const sizeToEdit = sizes.find((size) => size.id === id);
    if (sizeToEdit) {
      setEditingId(id);
      setFormData({
        size: sizeToEdit.size,
        min_chieu_cao: sizeToEdit.min_chieu_cao,
        max_chieu_cao: sizeToEdit.max_chieu_cao,
        min_can_nang: sizeToEdit.min_can_nang,
        max_can_nang: sizeToEdit.max_can_nang,
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const response = await fetch(`/api/size/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Cập nhật size thành công");
        fetchSizes();
        setEditingId(null);
        setFormData({
          size: "",
          min_chieu_cao: 0,
          max_chieu_cao: 0,
          min_can_nang: 0,
          max_can_nang: 0,
        });
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật size");
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý Size</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="input-size" className="text-sm font-medium">
              Size
            </Label>
            <Input
              id="input-size"
              type="text"
              placeholder="Nhập size (VD: S, M, L, XL)"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-min-height" className="text-sm font-medium">
              Chiều cao tối thiểu (cm)
            </Label>
            <Input
              id="input-min-height"
              type="number"
              placeholder="VD: 150"
              value={formData.min_chieu_cao}
              onChange={(e) => setFormData({ ...formData, min_chieu_cao: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-max-height" className="text-sm font-medium">
              Chiều cao tối đa (cm)
            </Label>
            <Input
              id="input-max-height"
              type="number"
              placeholder="VD: 170"
              value={formData.max_chieu_cao}
              onChange={(e) => setFormData({ ...formData, max_chieu_cao: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-min-weight" className="text-sm font-medium">
              Cân nặng tối thiểu (kg)
            </Label>
            <Input
              id="input-min-weight"
              type="number"
              placeholder="VD: 45"
              value={formData.min_can_nang}
              onChange={(e) => setFormData({ ...formData, min_can_nang: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-max-weight" className="text-sm font-medium">
              Cân nặng tối đa (kg)
            </Label>
            <Input
              id="input-max-weight"
              type="number"
              placeholder="VD: 65"
              value={formData.max_can_nang}
              onChange={(e) => setFormData({ ...formData, max_can_nang: Number(e.target.value) })}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          {editingId ? (
            <Button id="btn-update" type="button" onClick={handleUpdate}>
              Cập nhật
            </Button>
          ) : (
            <Button id="btn-add" type="submit">
              Thêm mới
            </Button>
          )}
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Chiều cao (min-max)</TableHead>
            <TableHead>Cân nặng (min-max)</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sizes.map((size) => (
            <TableRow key={size.id}>
              <TableCell>{size.size}</TableCell>
              <TableCell>{size.min_chieu_cao} - {size.max_chieu_cao}</TableCell>
              <TableCell>{size.min_can_nang} - {size.max_can_nang}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  id={`btn-edit-${size.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(size.id)}
                >
                  Sửa
                </Button>
                <Button
                  id={`btn-delete-${size.id}`}
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(size.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 