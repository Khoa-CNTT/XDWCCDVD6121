"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ message: "", isError: false, isSent: false });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ message: "", isError: false, isSent: false });

        if (!email) {
            setStatus({ message: "Vui lòng nhập email", isError: true, isSent: false });
            return;
        }

        try {
            const response = await fetch("/api/password-reset/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ 
                    message: "Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.", 
                    isError: false, 
                    isSent: true 
                });
            } else {
                setStatus({ 
                    message: data.message || "Không thể gửi yêu cầu khôi phục mật khẩu", 
                    isError: true, 
                    isSent: false 
                });
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            setStatus({ 
                message: "Lỗi kết nối đến máy chủ", 
                isError: true, 
                isSent: false 
            });
        }
    };

    return (
        <div 
            className="flex min-h-screen items-center justify-center"
            style={{ backgroundImage: "url('https://thethaovanhoa.mediacdn.vn/372676912336973824/2024/12/29/dah7144-1735440052943290598464.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Quên Mật Khẩu</CardTitle>
                </CardHeader>
                <CardContent>
                    {status.isSent ? (
                        <div className="text-center space-y-4">
                            <p className="text-green-600">{status.message}</p>
                            <Button 
                                onClick={() => router.push('/admin/login')}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Quay lại trang đăng nhập
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email-input"
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                            
                            {status.isError && <p className="text-red-500 text-sm">{status.message}</p>}
                            
                            <Button 
                                type="submit" 
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Gửi Yêu Cầu
                            </Button>
                            
                            <div className="text-center">
                                <Link href="/admin/login" className="text-amber-600 hover:text-amber-700 text-sm">
                                    Quay lại trang đăng nhập
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
  }