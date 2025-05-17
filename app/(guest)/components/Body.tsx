import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { VolumeX, Volume2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { Pacifico } from "next/font/google";

import "@fontsource/pacifico";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

const Body = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Mute video */
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;

      const video = videoRef.current;

      if (document.visibilityState === "hidden") {
        video.pause();
      } else if (document.visibilityState === "visible") {
        // Delay nhỏ để đảm bảo DOM ổn định
        setTimeout(() => {
          // Chỉ gọi play nếu video bị pause
          if (video.paused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn("Không thể tự động phát lại video:", err);
              });
            }
          }
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* Parallax */
  useGSAP(() => {
    if (!heroRef.current || !heroTextRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(heroRef.current, {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=600",
        scrub: true,
      },
    });

    gsap.to(heroTextRef.current, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=600",
        scrub: true,
      },
    });
  }, []);

  /* Split Hero Text */
  useGSAP(() => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    const runAnimation = () => {
      const split = SplitText.create(".main-text", {
        type: "chars",
        charsClass: "char",
      });
      const tl = gsap.timeline();

      tl.fromTo(
        split.chars,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "back.out(1.7)",
          duration: 1.2,
          delay: 7,
          stagger: {
            amount: 1,
            from: "start",
            ease: "power2.inOut",
          },
          onStart: () => {
            gsap.to(".main-text", { opacity: 1, duration: 0.01 });
          },
        }
      );
      tl.to(split.chars, {
        y: 200,
        ease: "back.out(1.7)",
      });
    };

    if (document.readyState === "complete") {
      runAnimation();
    } else {
      window.addEventListener("load", runAnimation);
      return () => window.removeEventListener("load", runAnimation);
    }
  }, []);

  return (
    <div className="h-full bg-white">
      {/* Hero div */}
      <div
        ref={heroRef}
        className=" hidden md:block hero relative w-full h-screen"
      >
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/wedding.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
        <button
          onClick={toggleMute}
          className="absolute bottom-9 left-7 z-30 bg-white/80 text-black p-2 rounded-full shadow-md hover:bg-white transition"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <div
          ref={heroTextRef}
          className="main-text opacity-0 font-pacifico absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center will-change-transform text-6xl md:text-9xl text-white font-bold z-20"
        >
          <p>Your love</p>
          <p className="inline-block font-pacifico w-fit mt-2 text-6xl md:text-9xl font-bold text-white">
            Our passion
          </p>
        </div>
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
      </div>
      <div className="relative w-full h-screen md:hidden">
        <img
          src="https://i.imgur.com/9Qqw20E.jpeg"
          alt="mobile-hero"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      {/* Phần các ảnh bên dưới */}
      <div className="grid grid-cols-1 md:flex md:flex-row my-3 md:space-x-3 mx-3 bg-white overflow-hidden">
        <button
          onClick={() => router.push("/vaycuoi")}
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
          onClick={() => router.push("/vaycuoi")}
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
          onClick={() => router.push("/vaycuoi")}
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
                onClick={() => router.push("/vaycuoi")}
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
                onClick={() => router.push("/rapcuoi")}
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
                onClick={() => router.push("/makeup")}
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
