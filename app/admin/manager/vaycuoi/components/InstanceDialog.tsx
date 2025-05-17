"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { AlertCircle, CheckCircle2, Wrench, Trash2, Clock } from "lucide-react";

interface VayInstance {
  id: number;
  ten: string;
  vay_id: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "RESERVED";
  rental_start: string | null;
  rental_end: string | null;
  reserved_at: string | null;
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  instanceId: number;
}

function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  instanceId,
}: DeleteDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Dialog.Panel}
              className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Title className="text-lg font-semibold leading-6 mb-4">
                Xác nhận xóa
              </Dialog.Title>
              <div>
                <p>Bạn có chắc chắn muốn xóa instance #{instanceId}?</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                  Xóa
                </Button>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface InstanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  instances: VayInstance[];
  dressName: string;
}

export default function InstanceDialog({
  isOpen,
  onClose,
  instances: initialInstances,
  dressName,
}: InstanceDialogProps) {
  const [instances, setInstances] = useState<VayInstance[]>(initialInstances);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    instanceId: number | null;
  }>({
    isOpen: false,
    instanceId: null,
  });
  // Count instances by status
  const statusCounts = {
    AVAILABLE: instances.filter((i) => i.status === "AVAILABLE").length,
    RENTED: instances.filter((i) => i.status === "RENTED").length,
    MAINTENANCE: instances.filter((i) => i.status === "MAINTENANCE").length,
    RESERVED: instances.filter((i) => i.status === "RESERVED").length,
  };

  const paginatedInstances = instances.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(instances.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize, 10));
    setCurrentPage(1); // Reset to first page when changing page size
  };
  const handleOpenDeleteDialog = (instanceId: number) => {
    setDeleteDialog({
      isOpen: true,
      instanceId,
    });
  };

  const handleDelete = async (instanceId: number) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/vayinstance/${instanceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete instance");
      }

      // Update local state
      setInstances((prevInstances) =>
        prevInstances.filter((instance) => instance.id !== instanceId)
      );

      toast.success("Xóa instance thành công");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa instance"
      );
    } finally {
      setIsUpdating(false);
      setDeleteDialog({
        isOpen: false,
        instanceId: null,
      });
    }
  };

  const handleStatusChange = async (
    instanceId: number,
    newStatus: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "RESERVED"
  ) => {
    try {
      setIsUpdating(true);
      const currentInstance = instances.find((inst) => inst.id === instanceId);
      const payload: { status: string; reserved_at?: Date | null } = {
        status: newStatus,
      };

      if (
        currentInstance &&
        currentInstance.status === "RESERVED" &&
        newStatus === "AVAILABLE"
      ) {
        payload.reserved_at = null;
      }
      // Note: if admin sets status to RESERVED manually, the API should handle setting reserved_at if it's not already set.
      // This client-side logic primarily handles clearing reserved_at when moving from RESERVED to AVAILABLE.

      const response = await fetch(`/api/vayinstance/${instanceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }
      const updatedInstanceFromServer = await response.json();

      setInstances((prevInstances) =>
        prevInstances.map((instance) =>
          instance.id === instanceId
            ? {
                ...instance,
                status: newStatus,
                reserved_at: updatedInstanceFromServer.reserved_at,
              }
            : instance
        )
      );

      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật trạng thái"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "RENTED":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "MAINTENANCE":
        return <Wrench className="h-4 w-4 text-yellow-500" />;
      case "RESERVED":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "text-green-700 bg-green-50 ring-green-600/20";
      case "RENTED":
        return "text-blue-700 bg-blue-50 ring-blue-600/20";
      case "MAINTENANCE":
        return "text-yellow-700 bg-yellow-50 ring-yellow-600/20";
      case "RESERVED":
        return "text-orange-700 bg-orange-50 ring-orange-600/20";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Dialog.Panel}
              className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Title className="text-xl font-semibold leading-6 mb-4">
                Chi tiết váy cưới: {dressName}
              </Dialog.Title>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-lg border bg-card px-4 py-3 text-card-foreground shadow">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-medium">Có sẵn</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    {statusCounts.AVAILABLE}
                  </p>
                </div>
                <div className="rounded-lg border bg-card px-4 py-3 text-card-foreground shadow">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <p className="text-sm font-medium">Đang cho thuê</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    {statusCounts.RENTED}
                  </p>
                </div>
                <div className="rounded-lg border bg-card px-4 py-3 text-card-foreground shadow">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm font-medium">Bảo trì</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    {statusCounts.MAINTENANCE}
                  </p>
                </div>
                <div className="rounded-lg border bg-card px-4 py-3 text-card-foreground shadow">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <p className="text-sm font-medium">Đang giữ trước</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    {statusCounts.RESERVED}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[200px]">Số</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày bắt đầu thuê</TableHead>
                      <TableHead>Ngày kết thúc thuê</TableHead>
                      <TableHead>Thời gian giữ</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInstances.map((instance) => (
                      <TableRow key={instance.id}>
                        <TableCell className="font-medium">
                          #{instance.id}
                        </TableCell>
                        <TableCell>{instance.ten}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(instance.status)}
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(
                                instance.status
                              )}`}
                            >
                              {instance.status === "AVAILABLE"
                                ? "Có sẵn"
                                : instance.status === "RENTED"
                                  ? "Đang cho thuê"
                                  : instance.status === "MAINTENANCE"
                                    ? "Bảo trì"
                                    : "Đang giữ trước"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(instance.rental_start)}
                        </TableCell>
                        <TableCell>{formatDate(instance.rental_end)}</TableCell>
                        <TableCell>
                          {formatDate(instance.reserved_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Select
                              value={instance.status}
                              onValueChange={(
                                value:
                                  | "AVAILABLE"
                                  | "RENTED"
                                  | "MAINTENANCE"
                                  | "RESERVED"
                              ) => handleStatusChange(instance.id, value)}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AVAILABLE">
                                  Có sẵn
                                </SelectItem>
                                <SelectItem value="RENTED">
                                  Đang cho thuê
                                </SelectItem>
                                <SelectItem value="MAINTENANCE">
                                  Bảo trì
                                </SelectItem>
                                <SelectItem value="RESERVED">
                                  Đang giữ trước
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleOpenDeleteDialog(instance.id)
                              }
                              disabled={
                                isUpdating ||
                                instance.status === "RENTED" ||
                                instance.status === "RESERVED"
                              }
                              className="hover:text-red-500"
                              title={
                                instance.status === "RENTED"
                                  ? "Không thể xóa váy đang cho thuê"
                                  : instance.status === "RESERVED"
                                    ? "Không thể xóa váy đang được giữ trước"
                                    : "Xóa instance"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Số dòng mỗi trang
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 30, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <span className="text-sm">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>

                <Button variant="outline" onClick={onClose}>
                  Đóng
                </Button>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, instanceId: null })}
        onConfirm={() =>
          deleteDialog.instanceId && handleDelete(deleteDialog.instanceId)
        }
        instanceId={deleteDialog.instanceId || 0}
      />
    </Transition>
  );
}
