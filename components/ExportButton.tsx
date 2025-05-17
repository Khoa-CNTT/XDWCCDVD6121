"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  tableName: string;
  fileName?: string;
}

export function ExportButton({
  tableName,
  fileName = "export.xlsx",
}: ExportButtonProps) {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export?table=${tableName}`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Tạo blob từ response
      const blob = await response.blob();

      // Tạo URL từ blob
      const url = window.URL.createObjectURL(blob);

      // Tạo link để tải file
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Click vào link để tải file
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Export Excel
    </Button>
  );
}
