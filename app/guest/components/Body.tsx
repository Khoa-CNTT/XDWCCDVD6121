import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Body = () => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const slideImages = [
    "https://i.imgur.com/9Qqw20E.jpeg",
    // "https://i.imgur.com/t0OXRg1.png",
    "https://i.imgur.com/6Dwiws7.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-white">
      {/* Hero div */}
      <div className="relative w-full h-screen">
        {slideImages.map((image, index) => (
          <button
            key={index}
            onClick={() => router.push("/guest/vaycuoi")}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              activeSlide === index
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={image}
              alt={`slide-${index}`}
              className="w-full h-full object-cover"
            />
            <p
              className="absolute alumni2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold uppercase"
              style={{ textShadow: "4px 4px 10px rgba(0, 0, 0, 0.8)" }}
            >
              wedding is a very important part
            </p>
            <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-black/70 to-transparent"></div>
          </button>
        ))}
      </div>
      {/* Phần các ảnh bên dưới */}
      <div className="grid grid-cols-1 md:flex md:flex-row my-3 md:space-x-3 mx-3 bg-white overflow-hidden">
        <button
          onClick={() => router.push("/guest/vaycuoi")}
          className="h-screen w-full md:w-1/3 bg-white transform translate-x-[-100%] opacity-0 animate-[slideIn_0.8s_ease-in-out_0.2s_forwards]"
          style={{
            animationFillMode: "forwards",
          }}
        >
          <img
            src="https://i.imgur.com/5KT621Z.png"
            alt="abc"
            className="object-cover size-full"
          />
        </button>
        <button
          onClick={() => router.push("/guest/vaycuoi")}
          className="h-screen w-full md:w-1/3 transform translate-x-[-100%] opacity-0 animate-[slideIn_0.8s_ease-in-out_0.8s_forwards]"
          style={{
            animationFillMode: "forwards",
          }}
        >
          <img
            src="https://i.imgur.com/g9c2QY2.png"
            alt="abc"
            className="object-cover size-full"
          />
        </button>
        <button
          onClick={() => router.push("/guest/vaycuoi")}
          className="h-screen w-full md:w-1/3 transform translate-x-[-100%] opacity-0 animate-[slideIn_0.8s_ease-in-out_1.4s_forwards]"
          style={{
            animationFillMode: "forwards",
          }}
        >
          <img
            src="https://i.imgur.com/ypDCEo3.jpeg"
            alt="abc"
            className="object-cover size-full"
          />
        </button>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {/* Second hero div */}
      <div className="hidden md:block relative h-[70vh]">
        <div className="h-full">
          <div className="absolute inset-0 " />
          <img
            src="https://i.imgur.com/Z8CIRof.png"
            alt="Wedding accessories"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-12">
          <Button
            size="lg"
            className="bg-rose-500 hover:bg-rose-400"
            onClick={() => router.push("/guest/vaycuoi")}
          >
            Tìm hiểu ngay
          </Button>
        </div>
      </div>
      {/* Categories */}
      <div className="py-16 bg-[#FDF8F6]">
        <div className=" mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase">
            Danh mục sản phẩm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden rounded-lg shadow-md h-64">
              <img
                src="https://i.imgur.com/gXXJMwT.png"
                alt="Váy Cưới"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                onClick={() => router.push("/guest/vaycuoi")}
              >
                <h3 className="text-white text-2xl font-bold">Váy Cưới</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg shadow-md h-64">
              <img
                src="https://i.imgur.com/xqV5ixs.png"
                alt="Rạp Cưới"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                onClick={() => router.push("/guest/rapcuoi")}
              >
                <h3 className="text-white text-2xl font-bold">Rạp Cưới</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg shadow-md h-64">
              <img
                src="https://i.imgur.com/sZ8gNfF.png"
                alt="Make Up"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                onClick={() => router.push("/guest/makeup")}
              >
                <h3 className="text-white text-2xl font-bold">Make Up</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="my-12 bg-white">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase">
            Đánh giá khách hàng
          </h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-3">
            <div className="bg-[#FDF8F6] p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://i.imgur.com/VaIxsDi.png"
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Phạm Trang</h4>
                  <p className="text-sm text-gray-500">April 2023</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Những dịch vụ tôi đã sử dụng thật sự tốt và làm cho ngày cưới
                của tôi trở nên đặc biệt hơn. Chất lượng thật xuất sắc!"
              </p>
            </div>
            <div className="bg-[#FDF8F6] p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://i.imgur.com/daKwddm.png"
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Jun Phạm</h4>
                  <p className="text-sm text-gray-500">March 2024</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Tôi thật sự đánh giá cao những dịch vụ mà Hady đã mang lại cho
                tôi. Thật sự tuyệt vời!"
              </p>
            </div>
            <div className="bg-[#FDF8F6] p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://i.imgur.com/KOWbMTW.png"
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Thuỳ Tiên</h4>
                  <p className="text-sm text-gray-500">September 2024</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Mọi thứ thật hoàn hảo, những bộ váy cưới lộng lẫy và những rạp
                cưới tuyệt đẹp làm tôi cảm thấy rất tuyệt vời. Cảm ơn những gì
                Hady đã mang lại cho chúng tôi!"
              </p>
            </div>
            <div className="bg-[#FDF8F6] p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://i.imgur.com/a2AOksM.png"
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">June 2023</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The accessories I purchased were absolutely stunning and made
                my wedding day even more special. The quality was exceptional. I
                love Hady."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
