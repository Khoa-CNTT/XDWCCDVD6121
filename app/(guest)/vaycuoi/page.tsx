"use client";

import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { SizeCombobox } from "@/components/ui/size-combobox";
import { MauCombobox } from "@/components/ui/mau-combobox";
import { DoTuoiCombobox } from "@/components/ui/dotuoi-combobox";
import { Input } from "@/components/ui/input";

interface Filters {
  mauVay: number[];
  size: number[];
  doTuoi: number[];
  chieuCao?: number;
  canNang?: number;
}

interface Size {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

interface Mau {
  id: number;
  ten_mau: string;
}

interface DoTuoi {
  id: number;
  dotuoi: number;
}

const ProductPage = () => {
  const [filters, setFilters] = useState<Filters>({
    mauVay: [],
    size: [],
    doTuoi: [],
    chieuCao: undefined,
    canNang: undefined,
  });
  const [open, setOpen] = useState(false);
  const [tempChieuCao, setTempChieuCao] = useState<string>("");
  const [tempCanNang, setTempCanNang] = useState<string>("");
  const [mauList, setMauList] = useState<Mau[]>([]);
  const [sizeList, setSizeList] = useState<Size[]>([]);
  const [doTuoiList, setDoTuoiList] = useState<DoTuoi[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mauRes, sizeRes, doTuoiRes] = await Promise.all([
          fetch("/api/mau"),
          fetch("/api/size"),
          fetch("/api/dotuoi"),
        ]);

        const mauData = await mauRes.json();
        const sizeData = await sizeRes.json();
        const doTuoiData = await doTuoiRes.json();

        setMauList(mauData.datas || []);
        setSizeList(sizeData.datas || []);
        setDoTuoiList(doTuoiData.datas || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMauChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      mauVay: value ? [parseInt(value)] : [],
    }));
  };

  const handleSizeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      size: value ? [parseInt(value)] : [],
    }));
  };

  const handleDoTuoiChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      doTuoi: value ? [parseInt(value)] : [],
    }));
  };

  // Tính số lượng filter đã chọn
  const selectedFiltersCount = [
    filters.mauVay.length > 0,
    filters.size.length > 0,
    filters.doTuoi.length > 0,
    filters.chieuCao !== undefined,
    filters.canNang !== undefined,
  ].filter(Boolean).length;

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      chieuCao: tempChieuCao ? parseInt(tempChieuCao) : undefined,
      canNang: tempCanNang ? parseInt(tempCanNang) : undefined,
    }));
    setOpen(false);
  };

  const handleClearAll = () => {
    setFilters({
      mauVay: [],
      size: [],
      doTuoi: [],
      chieuCao: undefined,
      canNang: undefined,
    });
    setTempChieuCao("");
    setTempCanNang("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Váy Cưới
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-sm font-medium tracking-wider hover:opacity-70 transition-opacity"
          >
            <span className="hidden md:inline">FILTER</span>
            <span className="md:hidden">
              <FunnelIcon className="h-5 w-5" />
            </span>
            {selectedFiltersCount > 0 ? `(${selectedFiltersCount})` : ""} +
          </button>
        </div>

        <div className="px-4 md:px-16">
          <ProductCard filters={filters} />
        </div>

        {open && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setOpen(false)}
            />
            <div className="absolute top-0 right-0 w-full sm:max-w-[600px] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h5 className="font-normal tracking-tighter uppercase text-xl">
                    Filter
                  </h5>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="flex flex-col gap-5">
                    <div className="space-y-4">
                      <h6 className="uppercase font-semibold">Màu váy</h6>
                      <MauCombobox
                        mauList={mauList}
                        value={filters.mauVay[0]?.toString() || ""}
                        onChange={handleMauChange}
                      />
                    </div>

                    <div className="space-y-4">
                      <h6 className="uppercase font-semibold">Kích thước</h6>
                      <SizeCombobox
                        sizes={sizeList}
                        value={filters.size[0]?.toString() || ""}
                        onChange={handleSizeChange}
                      />
                    </div>

                    <div className="space-y-4">
                      <h6 className="uppercase font-semibold">Độ tuổi</h6>
                      <DoTuoiCombobox
                        doTuoiList={doTuoiList}
                        value={filters.doTuoi[0]?.toString() || ""}
                        onChange={handleDoTuoiChange}
                      />
                    </div>

                    <div className="space-y-4">
                      <h6 className="uppercase font-semibold">Số đo</h6>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            type="number"
                            placeholder="Chiều cao (cm)"
                            value={tempChieuCao}
                            onChange={(e) => setTempChieuCao(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Cân nặng (kg)"
                            value={tempCanNang}
                            onChange={(e) => setTempCanNang(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex border-t border-gray-200">
                  <button
                    onClick={handleClearAll}
                    className="flex-1 py-4 text-xl text-black uppercase font-bold hover:bg-gray-100 transition-colors"
                  >
                    xoá
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 py-4 text-xl text-white bg-gray-900 uppercase font-semibold hover:bg-gray-800 transition-colors"
                  >
                    áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
