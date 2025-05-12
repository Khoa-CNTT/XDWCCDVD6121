'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type Transaction = {
  id: number;
  so_tien: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  created_at: string;
  updated_at: string;
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    so_tien: 0,
    payment_status: 'PENDING' as const
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transaction')
      const data = await response.json()
      setTransactions(data.datas || [])
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu giao dịch:', error)
      setAlertMessage('Đã xảy ra lỗi khi tải dữ liệu giao dịch')
      setAlertOpen(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [refreshKey])

  const handleCreateTransaction = async () => {
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      })

      if (response.ok) {
        setAlertMessage('Tạo giao dịch thành công')
        setOpenDialog(false)
        setNewTransaction({
          so_tien: 0,
          payment_status: 'PENDING'
        })
        setRefreshKey(prev => prev + 1) // Làm mới danh sách
      } else {
        setAlertMessage('Đã xảy ra lỗi khi tạo giao dịch')
      }
    } catch (error) {
      console.error('Lỗi khi tạo giao dịch:', error)
      setAlertMessage('Đã xảy ra lỗi khi tạo giao dịch')
    } finally {
      setAlertOpen(true)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="container mx-auto p-6">
      <Card id="transaction-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Quản lý giao dịch</CardTitle>
            <CardDescription>Quản lý tất cả các giao dịch thanh toán</CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button id="btn-add-transaction" variant="default">Thêm giao dịch</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm giao dịch mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin để tạo giao dịch mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="so_tien" className="text-right">
                    Số tiền
                  </Label>
                  <Input
                    id="so_tien"
                    type="number"
                    className="col-span-3"
                    value={newTransaction.so_tien}
                    onChange={(e) => setNewTransaction({ ...newTransaction, so_tien: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment_status" className="text-right">
                    Trạng thái
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewTransaction({ 
                      ...newTransaction, 
                      payment_status: value as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' 
                    })}
                    defaultValue={newTransaction.payment_status}
                  >
                    <SelectTrigger id="payment_status" className="col-span-3">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Đang chờ</SelectItem>
                      <SelectItem value="PAID">Đã thanh toán</SelectItem>
                      <SelectItem value="FAILED">Thất bại</SelectItem>
                      <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button id="btn-save-transaction" type="submit" onClick={handleCreateTransaction}>Lưu giao dịch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Không có giao dịch nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table id="transaction-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} id={`transaction-row-${transaction.id}`}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{formatCurrency(transaction.so_tien)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.payment_status)}>
                          {transaction.payment_status === 'PENDING' && 'Đang chờ'}
                          {transaction.payment_status === 'PAID' && 'Đã thanh toán'}
                          {transaction.payment_status === 'FAILED' && 'Thất bại'}
                          {transaction.payment_status === 'REFUNDED' && 'Đã hoàn tiền'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(transaction.created_at)}</TableCell>
                      <TableCell>{formatDate(transaction.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TransactionPage