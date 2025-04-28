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

interface Filters {
  mau: number[];
  soGhe: number[];
  soDayGhe: number[];
}

const RapCuoiPage = () => {
  const [open, setOpen] = useState(false);
  const [mau, setMau] = useState<any[]>([]);
  const [soGhe, setSoGhe] = useState<any[]>([]);
  const [soDayGhe, setSoDayGhe] = useState<any[]>([]);
  const [selectedMau, setSelectedMau] = useState<number[]>([]);
  const [selectedSoGhe, setSelectedSoGhe] = useState<number[]>([]);
  const [selectedSoDayGhe, setSelectedSoDayGhe] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({
    mau: [],
    soGhe: [],
    soDayGhe: [],
  });

  useEffect(() => {
    // Fetch data for filters
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

        setMau(mauData.datas || []);
        setSoGhe(soGheData.datas || []);
        setSoDayGhe(soDayGheData.datas || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  // Cập nhật filters mỗi khi có thay đổi lựa chọn
  useEffect(() => {
    setFilters({
      mau: selectedMau,
      soGhe: selectedSoGhe,
      soDayGhe: selectedSoDayGhe,
    });
  }, [selectedMau, selectedSoGhe, selectedSoDayGhe]);

  const handleMauChange = (id: number) => {
    setSelectedMau((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSoGheChange = (id: number) => {
    setSelectedSoGhe((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSoDayGheChange = (id: number) => {
    setSelectedSoDayGhe((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSelectedMau([]);
    setSelectedSoGhe([]);
    setSelectedSoDayGhe([]);
  };

  // Tính toán số lượng filter đã chọn
  const selectedFiltersCount = [
    selectedMau.length,
    selectedSoGhe.length,
    selectedSoDayGhe.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="sticky top-[6vh] md:top-[6vh] z-10 bg-white py-4 px-4 md:px-6 flex justify-end text-black">
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

        <div className="flex flex-col gap-2 h-[90vh] overflow-y-auto pr-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                màu rạp
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {mau.map((m) => (
                <Checkbox
                  key={m.id}
                  label={m.ten_mau}
                  checked={selectedMau.includes(m.id)}
                  onChange={() => handleMauChange(m.id)}
                  className="hover:before:opacity-0"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                số ghế
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {soGhe.map((sg) => (
                <Checkbox
                  key={sg.id}
                  label={sg.so_luong_ghe}
                  checked={selectedSoGhe.includes(sg.id)}
                  onChange={() => handleSoGheChange(sg.id)}
                  className="hover:before:opacity-0"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                số dãy ghế
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {soDayGhe.map((sdg) => (
                <Checkbox
                  key={sdg.id}
                  label={sdg.so_luong_day_ghe}
                  checked={selectedSoDayGhe.includes(sdg.id)}
                  onChange={() => handleSoDayGheChange(sdg.id)}
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

export default RapCuoiPage;
