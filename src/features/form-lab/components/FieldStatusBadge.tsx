import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/helpers";
import {
  getFieldStatusBadgeClasses,
  getFieldStatusBadgeLabel,
  type FieldValidationStatus,
} from "@/features/form-lab/utils";

interface FieldStatusBadgeProps {
  status: FieldValidationStatus;
}

export function FieldStatusBadge({ status }: FieldStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase",
        getFieldStatusBadgeClasses(status)
      )}
    >
      {status === "pending" ? (
        <>
          <Loader2 size={10} className="animate-spin" aria-hidden="true" />
          {getFieldStatusBadgeLabel(status)}
        </>
      ) : (
        getFieldStatusBadgeLabel(status)
      )}
    </span>
  );
}
