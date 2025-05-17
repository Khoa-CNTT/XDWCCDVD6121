"use client";
import React, { useEffect, useState } from "react";
import { SlClose } from "react-icons/sl";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    //local
    const localstore = "thongbaogiamgia";
    const currentTime = Date.now();
    const twentyMinutes = 20 * 60 * 1000;
    const lastShow = localStorage.getItem(localstore);

    if (!lastShow || currentTime - Number(lastShow) >= twentyMinutes) {
      setIsOpen(true);
      localStorage.setItem(localstore, currentTime.toString());
    }

    // dùng esc để thoát thông báo
    const hanlekeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);

    window.addEventListener("keydown", hanlekeydown);
  }, []);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 image">
          <div className="animate-slideDown p-6 rounded-xl  relative">
            <img
              src="https://wxefqurgwi.ufs.sh/f/nWmoVirSWx9r0c7tmxiFiAyXYcIjPKa7x4Q3dV5JHgz12NDl"
              alt="Image"
              className="w-[50vh]"
            />
            <button
              className="absolute top-2 right-4  cursor-pointer  text-gray-900 hover:text-red-500 bg-white text-2xl  rounded-full  mt-2 ml-2" // Đặt vị trí nút "X"
              onClick={() => setIsOpen(false)}
            >
              <SlClose />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
