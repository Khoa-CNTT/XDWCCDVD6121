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
  phongCach: number[];
}

const MakeupPage = () => {
  const [open, setOpen] = useState(false);
  const [phongCach, setPhongCach] = useState<any[]>([]);
  const [selectedPhongCach, setSelectedPhongCach] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({
    phongCach: [],
  });

  useEffect(() => {
    // Fetch data for filters
    const fetchData = async () => {
      try {
        const phongCachRes = await fetch("/api/phongcach");
        const phongCachData = await phongCachRes.json();
        setPhongCach(phongCachData.datas || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  // Cập nhật filters mỗi khi có thay đổi lựa chọn
  useEffect(() => {
    setFilters({
      phongCach: selectedPhongCach,
    });
  }, [selectedPhongCach]);

  const handlePhongCachChange = (id: number) => {
    setSelectedPhongCach((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSelectedPhongCach([]);
  };

  // Tính toán số lượng filter đã chọn
  const selectedFiltersCount = selectedPhongCach.length;

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

        <div className="flex flex-col gap-5 h-[90vh] overflow-y-auto pr-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                phong cách
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {phongCach.map((pc) => (
                <Checkbox
                  key={pc.id}
                  label={pc.ten_phong_cach}
                  checked={selectedPhongCach.includes(pc.id)}
                  onChange={() => handlePhongCachChange(pc.id)}
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

export default MakeupPage;
