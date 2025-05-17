import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  image: {
    url: string;
    title: string;
  } | null;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreviewDialog({
  image,
  onOpenChange,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={!!image} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{image?.title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[600px] overflow-hidden">
          {image && (
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
