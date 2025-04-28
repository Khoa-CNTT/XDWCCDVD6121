"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import {
  Drawer,
  Typography,
  IconButton,
  Checkbox,
} from "@material-tailwind/react";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import PathName from "../components/PathName";

interface Filters {
  mauVay: number[];
  kichThuoc: number[];
  doTuoi: number[];
}

interface FilterData {
  id: number;
  ten_mau?: string;
  kich_thuoc?: string;
  dotuoi?: number;
}

const ProductPage = () => {
  const [filters, setFilters] = useState<Filters>({
    mauVay: [],
    kichThuoc: [],
    doTuoi: [],
  });
  const [open, setOpen] = useState(false);
  const [mauVay, setMauVay] = useState<FilterData[]>([]);
  const [kichThuoc, setKichThuoc] = useState<FilterData[]>([]);
  const [doTuoi, setDoTuoi] = useState<FilterData[]>([]);
  const [selectedMauVay, setSelectedMauVay] = useState<number[]>([]);
  const [selectedKichThuoc, setSelectedKichThuoc] = useState<number[]>([]);
  const [selectedDoTuoi, setSelectedDoTuoi] = useState<number[]>([]);

  useEffect(() => {
    // Fetch data for filters
    const fetchData = async () => {
      try {
        const [mauVayRes, kichThuocRes, doTuoiRes] = await Promise.all([
          fetch("/api/mau"),
          fetch("/api/kichthuoc"),
          fetch("/api/dotuoi"),
        ]);

        const mauVayData = await mauVayRes.json();
        const kichThuocData = await kichThuocRes.json();
        const doTuoiData = await doTuoiRes.json();

        setMauVay(mauVayData.datas || []);
        setKichThuoc(kichThuocData.datas || []);
        setDoTuoi(doTuoiData.datas || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  // Cập nhật filters mỗi khi có thay đổi lựa chọn
  useEffect(() => {
    setFilters({
      mauVay: selectedMauVay,
      kichThuoc: selectedKichThuoc,
      doTuoi: selectedDoTuoi,
    });
  }, [selectedMauVay, selectedKichThuoc, selectedDoTuoi]);

  const handleMauVayChange = (id: number) => {
    setSelectedMauVay((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleKichThuocChange = (id: number) => {
    setSelectedKichThuoc((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDoTuoiChange = (id: number) => {
    setSelectedDoTuoi((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSelectedMauVay([]);
    setSelectedKichThuoc([]);
    setSelectedDoTuoi([]);
  };

  // Tính toán số lượng filter đã chọn
  const selectedFiltersCount = [
    selectedMauVay.length,
    selectedKichThuoc.length,
    selectedDoTuoi.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="sticky top-[6vh] md:top-[6vh] z-10 bg-white pb-2 pt-4 px-4 md:px-6 flex justify-end text-black">
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

      {/* Filter Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        className="p-4"
        placement="right"
        size={600}
      >
        <div className="flex items-center justify-between mb-6">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-normal tracking-tighter uppercase"
          >
            filter
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>

        <div className="flex flex-col gap-5 h-[90vh] overflow-y-auto pr-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                màu váy
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {mauVay.map((mau) => (
                <Checkbox
                  key={mau.id}
                  label={mau.ten_mau}
                  checked={selectedMauVay.includes(mau.id)}
                  onChange={() => handleMauVayChange(mau.id)}
                  className="hover:before:opacity-0"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                kích thước
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {kichThuoc.map((kich) => (
                <Checkbox
                  key={kich.id}
                  label={kich.kich_thuoc}
                  checked={selectedKichThuoc.includes(kich.id)}
                  onChange={() => handleKichThuocChange(kich.id)}
                  className="hover:before:opacity-0"
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                độ tuổi
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {doTuoi.map((tuoi) => (
                <Checkbox
                  key={tuoi.id}
                  label={String(tuoi.dotuoi)}
                  checked={selectedDoTuoi.includes(tuoi.id)}
                  onChange={() => handleDoTuoiChange(tuoi.id)}
                  className="hover:before:opacity-0"
                />
              ))}
            </div>
          </div>
          {/* Cụm dưới Drawer */}
          <div className="flex flex-row absolute bottom-0 left-0 right-0 h-[10vh] bg-white">
            <button
              onClick={handleClearAll}
              className="mt-4 w-full py-2 text-xl text-black border-t border-black uppercase font-bold"
            >
              xoá
            </button>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 text-xl text-white bg-gray-900 border-t border-black uppercase font-semibold"
            >
              áp dụng
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ProductPage;
