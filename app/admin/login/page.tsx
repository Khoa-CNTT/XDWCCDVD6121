"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
    
        try {
            // Sử dụng identifier có thể là username hoặc email
            const response = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
    
            if (response.ok) {
                router.push('/admin');
            } else {
                setError(data.msg || "Đăng nhập thất bại");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setError("Lỗi kết nối đến máy chủ");
        }
    };

    return (
        <div 
            className="flex min-h-screen items-center justify-center"
            style={{ backgroundImage: "url('https://thethaovanhoa.mediacdn.vn/372676912336973824/2024/12/29/dah7144-1735440052943290598464.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Đăng Nhập</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="identifier">Tên đăng nhập hoặc Email</Label>
                            <Input 
                                id="identifier-input"
                                type="text" 
                                name="identifier"
                                value={formData.identifier} 
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                placeholder="Nhập tên đăng nhập hoặc email"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input 
                                id="password-input"
                                type="password"
                                name="password"
                                value={formData.password} 
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        
                        <div className="text-right">
                            <Link href="/admin/login/quenmk" className="text-amber-600 hover:text-amber-700 text-sm">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <Button 
                            id="login-button"
                            type="submit" 
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Đăng Nhập
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
