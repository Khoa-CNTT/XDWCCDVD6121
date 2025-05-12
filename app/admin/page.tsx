"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const id = document.cookie.split("; ").find(row => row.startsWith("auth-id="))?.split("=")[1];
        
        if (id) {
            router.push("/admin/login"); // Chuyển hướng nếu chưa đăng nhập
        } else {
            setIsAuth(true);
        }
    }, [router]);

    // if (!isAuth) {
    //     return null; // Tránh render khi chưa xác thực
    // }

    return (
        <div>
            <h1 className="text-2xl font-bold">Chào mừng đến với trang admin</h1>
        </div>
    );
}
