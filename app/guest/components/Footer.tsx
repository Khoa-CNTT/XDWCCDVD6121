"use client";
import { Button, Input } from "@material-tailwind/react";
import React from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { HiArrowLongRight } from "react-icons/hi2";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="flex flex-col justify-center items-center mt-10 bg-white text-black border-t border-gray-400">
      <div className="w-[80vw] grid grid-cols-2 md:flex md:justify-between mx-auto px-6 py-10 gap-8">
        {/* VỀ CHÚNG TÔI */}
        <div className="hidden md:block space-y-4 basis-2/6">
          <h1 className="text-xl font-bold">VỀ CHÚNG TÔI</h1>
          <div className="text-sm leading-relaxed opacity-100 flex flex-col gap-1">
            HADY SHOP luôn đồng hành cùng bạn trong ngày trọng đại nhất của cuộc
            đời.
            <br />
            <div>
              Mỗi thiết kế đều là sản phẩm được sản xuất tỉ mỉ và chất lượng.
            </div>
            <div>
              Chúng tôi luôn cam kết về giá thành và độ tin cậy của sản phẩm.
            </div>
          </div>
        </div>

        {/* THÔNG TIN LIÊN HỆ */}
        <div className="text-start space-y-4 basis-1/6 ml-10">
          <h1 className="text-xl font-bold ">THÔNG TIN LIÊN HỆ</h1>
          <p className="text-sm">📞 CSKH: 0783.324.234</p>
          <p className="text-sm">🛒 Mua hàng: 0783.324.234</p>
          <p className="text-sm">📧 Email: info@hadyshop.com</p>
        </div>

        {/* THÔNG TIN SHOP */}
        <div className="text-start space-y-4 basis-1/6">
          <h1 className="text-xl font-bold ">TÌM HIỂU THÊM</h1>
          <div
            className="text-sm cursor-pointer hover:text-rose-400"
            onClick={() => router.push("/guest/about")}
          >
            ABOUT US
          </div>
          <div
            className="text-sm cursor-pointer hover:text-rose-400"
            onClick={() => router.push("/guest/contact")}
          >
            CONTACT
          </div>
          <div
            className="text-sm cursor-pointer hover:text-rose-400"
            onClick={() => router.push("/guest/contact#faq")}
          >
            FAQ
          </div>
        </div>
        {/* MẠNG XÃ HỘI */}
        <div className="hidden md:block text-center space-y-4 basis-2/6">
          <div className="flex justify-center">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61573743392646&tabs=timeline&width=400&height=100&small_header=false&adapt_container_width=true&hide_cover=true&show_facepile=true&appId"
              width="400"
              height="127"
              className="border-none overflow-hidden rounded-lg shadow-md"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </div>
      {/* Search theo mã đơn hàng */}
      <div className="relative">
        <Input
          variant="standard"
          label="Nhập mã đơn hàng của bạn"
          color="black"
          className="uppercase"
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const orderId = e.currentTarget.value;
              if (orderId) {
                router.push(`/guest/search?id=${orderId}`);
              }
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.querySelector(
              'input[type="text"]'
            ) as HTMLInputElement;
            const orderId = input?.value.trim();
            if (orderId) {
              router.push(`/guest/search?id=${orderId}`);
            }
          }}
          className="focus:outline-none"
        >
          <HiArrowLongRight
            className="absolute top-0 right-[0%] translate-x-[50%] translate-y-[50%] size-6"
            onClick={() => {
              const input = document.querySelector(
                'input[type="text"]'
              ) as HTMLInputElement;
              const orderId = input?.value.trim();
              if (orderId) {
                router.push(`/guest/search?id=${orderId}`);
              }
            }}
            color="black"
          />
        </button>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t w-full border-gray-400 py-4 text-center text-sm text-black">
        Copyright© 2025 |
        <span className="ml-1 font-semibold">Hady Shop Developers</span>
      </div>
    </footer>
  );
};

export default Footer;
