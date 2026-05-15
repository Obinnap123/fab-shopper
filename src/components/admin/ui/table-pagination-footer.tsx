"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TablePaginationFooterProps = {
  page: number;
  totalPages: number;
  pageNumbers: number[];
  pageSizeLabel?: string;
  onPageChange: (page: number) => void;
};

export function TablePaginationFooter({
  page,
  totalPages,
  pageNumbers,
  pageSizeLabel = "10",
  onPageChange
}: TablePaginationFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-forest/60">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <Select value={pageSizeLabel} disabled>
          <SelectTrigger className="h-10 w-[90px] rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={pageSizeLabel}>{pageSizeLabel}</SelectItem>
          </SelectContent>
        </Select>
        <span>Entries</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            size="sm"
            variant={pageNumber === page ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
