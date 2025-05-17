"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { SoGheCombobox } from "@/components/ui/soghe-combobox";
import { SoDayGheCombobox } from "@/components/ui/sodayghe-combobox";
import { MauCombobox } from "@/components/ui/mau-combobox";

interface Filters {
  mau: number[];
  soGhe: number[];
  soDayGhe: number[];
}

interface Mau {
  id: number;
  ten_mau: string;
}

interface SoGhe {
  id: number;
  so_ghe: number;
}

interface SoDayGhe {
  id: number;
  so_day_ghe: number;
}

const RapCuoiPage = () => {
  const [open, setOpen] = useState(false);
  const [mauList, setMauList] = useState<Mau[]>([]);
  const [soGheList, setSoGheList] = useState<SoGhe[]>([]);
  const [soDayGheList, setSoDayGheList] = useState<SoDayGhe[]>([]);
  const [filters, setFilters] = useState<Filters>({
    mau: [],
    soGhe: [],
    soDayGhe: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mauRes, soGheRes, soDayGheRes] = await Promise.all([
          fetch("/api/mau"),
          fetch("/api/soghe"),
          fetch("/api/sodayghe"),
        ]);

        const mauData = await mauRes.json();
        const soGheData = await soGheRes.json();
        const soDayGheData = await soDayGheRes.json();

        setMauList(mauData.datas || []);
        setSoGheList(soGheData.datas || []);
        setSoDayGheList(soDayGheData.datas || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMauChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      mau: value ? [parseInt(value)] : [],
    }));
  };

  const handleSoGheChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      soGhe: value ? [parseInt(value)] : [],
    }));
  };

  const handleSoDayGheChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      soDayGhe: value ? [parseInt(value)] : [],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      mau: [],
      soGhe: [],
      soDayGhe: [],
    });
  };

  const selectedFiltersCount = [
    filters.mau.length,
    filters.soGhe.length,
    filters.soDayGhe.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rạp Cưới
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
                      <h6 className="uppercase font-semibold">Màu sắc</h6>
                      <MauCombobox
                        mauList={mauList}
                        value={filters.mau[0]?.toString() || ""}
                        onChange={handleMauChange}
                      />
                    </div>

                    <div className="space-y-4">
                      <h6 className="uppercase font-semibold">Số ghế</h6>
                      <SoGheCombobox
                        soGheList={soGheList}
                        value={filters.soGhe[0]?.toString() || ""}
                        onChange={handleSoGheChange}
                      />
                    </div>

                    <div className="space-y-4">
                      <h6 className="uppercase font-semibold">Số dãy ghế</h6>
                      <SoDayGheCombobox
                        soDayGheList={soDayGheList}
                        value={filters.soDayGhe[0]?.toString() || ""}
                        onChange={handleSoDayGheChange}
                      />
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
                    onClick={() => setOpen(false)}
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

export default RapCuoiPage;
