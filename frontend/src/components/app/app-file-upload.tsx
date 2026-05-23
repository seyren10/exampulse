import { useCallback, useRef, useState } from "react";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FileUploadProps = {
  value?: File | string | null; // File = new upload, string = existing URL
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMb?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Reusable drag-and-drop file upload.
 *
 * Usage:
 *   <FileUpload
 *     value={field.value}
 *     onChange={field.onChange}
 *     accept="image/*"
 *     maxSizeMb={2}
 *   />
 */
export default function AppFileUpload({
  value,
  onChange,
  accept = "image/*",
  maxSizeMb = 2,
  disabled = false,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Preview URL ────────────────────────────────────────────────────────────

  const previewUrl =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
        ? value
        : null;

  // ── Validation ─────────────────────────────────────────────────────────────

  function validate(file: File): string | null {
    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      return `File must be smaller than ${maxSizeMb}MB.`;
    }
    if (accept && accept !== "*") {
      const accepted = accept.split(",").map((a) => a.trim());
      const isValid = accepted.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", "/"));
        }
        return file.type === type;
      });
      if (!isValid) return `Invalid file type.`;
    }
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onChange(file);
  }

  // ── Input change ───────────────────────────────────────────────────────────

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  // ── Drag events ────────────────────────────────────────────────────────────

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accept, maxSizeMb],
  );

  // ── Clear ──────────────────────────────────────────────────────────────────

  function onClear(e: React.MouseEvent) {
    e.stopPropagation();
    setError(null);
    onChange(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) =>
          !disabled && e.key === "Enter" && inputRef.current?.click()
        }
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/40 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-50",
          error && "border-destructive/50",
        )}
      >
        {previewUrl ? (
          // ── Preview ────────────────────────────────────────────────────────
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 w-full rounded object-contain px-4 py-2"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 size-6"
              onClick={onClear}
              aria-label="Remove image"
            >
              <X className="size-3" />
            </Button>
            <span className="pb-2 text-xs text-muted-foreground">
              Click or drop to replace
            </span>
          </>
        ) : (
          // ── Placeholder ────────────────────────────────────────────────────
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              {isDragging ? (
                <UploadCloud className="size-6 text-primary" />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm font-medium">
                {isDragging ? "Drop to upload" : "Upload image"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag & drop or{" "}
                <span className="text-primary underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Max {maxSizeMb}MB</p>
            </div>
          </>
        )}
      </div>

      {/* ── Error ── */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* ── Hidden input ── */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled}
      />
    </div>
  );
}
