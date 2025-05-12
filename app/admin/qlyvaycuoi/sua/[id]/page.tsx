"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

interface VayCuoi {
  id: number;
  ten: string;
  gia: number;
  anh: string;
  size_id: number;
}

interface KichThuoc {
  id: number;
  size: string;
}

export default function SuaVayCuoi() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vayCuoi, setVayCuoi] = useState<VayCuoi | null>(null);
  const [danhSachKichThuoc, setDanhSachKichThuoc] = useState<KichThuoc[]>([]);
  const [formData, setFormData] = useState({
    ten: "",
    gia: "",
    size_id: "",
    anh: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resVayCuoi, resKichThuoc] = await Promise.all([
          fetch(`/api/vaycuoi/${id}`),
          fetch("/api/size"),
        ]);

        const [dataVayCuoi, dataKichThuoc] = await Promise.all([
          resVayCuoi.json(),
          resKichThuoc.json(),
        ]);

        if (dataVayCuoi.datas) {
          setVayCuoi(dataVayCuoi.datas);
          setFormData({
            ten: dataVayCuoi.datas.ten,
            gia: dataVayCuoi.datas.gia.toString(),
            size_id: dataVayCuoi.datas.size_id.toString(),
            anh: dataVayCuoi.datas.anh,
          });
        }
        setDanhSachKichThuoc(dataKichThuoc.datas);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ten: formData.ten,
        gia: parseInt(formData.gia),
        size_id: parseInt(formData.size_id),
        anh: formData.anh,
      };
      console.log("Payload gửi lên API:", payload);
      const response = await fetch(`/api/vaycuoi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", response.status, errorText);
        throw new Error("Lỗi khi cập nhật váy cưới: " + errorText);
      }

      toast.success("Cập nhật váy cưới thành công");
      router.push("/admin/qlyvaycuoi");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật váy cưới");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
          id="btn-quay-lai"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sửa thông tin váy cưới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ten">Tên váy cưới</Label>
              <Input
                id="ten"
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
                required
                placeholder="Nhập tên váy cưới"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gia">Giá (VNĐ)</Label>
              <Input
                id="gia"
                type="number"
                value={formData.gia}
                onChange={(e) =>
                  setFormData({ ...formData, gia: e.target.value })
                }
                required
                placeholder="Nhập giá váy cưới"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Kích thước</Label>
              <Select
                value={formData.size_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, size_id: value })
                }
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Chọn kích thước" />
                </SelectTrigger>
                <SelectContent>
                  {danhSachKichThuoc.map((size) => (
                    <SelectItem key={size.id} value={size.id.toString()}>
                      {size.size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anh">URL hình ảnh</Label>
              <Input
                id="anh"
                value={formData.anh}
                onChange={(e) =>
                  setFormData({ ...formData, anh: e.target.value })
                }
                required
                placeholder="Nhập URL hình ảnh"
              />
            </div>

            {formData.anh && (
              <div className="mt-4">
                <Label>Xem trước hình ảnh</Label>
                <div className="mt-2 relative w-40 h-40">
                  <img
                    src={formData.anh}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                id="btn-huy"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
                id="btn-luu"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 