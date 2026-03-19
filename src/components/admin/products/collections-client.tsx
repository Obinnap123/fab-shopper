"use client";

import { useQuery } from "@tanstack/react-query";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Collection = {
  id: string;
  name: string;
  _count?: { products: number };
};

export function CollectionsClient() {
  const { data } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      const json = await res.json();
      return json.data as Collection[];
    }
  });

  const collections = data ?? [];

  return (
    <div className="space-y-6">
      <span className="inline-flex h-10 items-center rounded-full bg-forest/10 px-4 text-xs font-semibold text-forest">
        Showing {collections.length} Collections
      </span>

      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50">
            <TableHead>Collection</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => {
            const count = collection._count?.products ?? 0;
            return (
              <TableRow key={collection.id}>
                <TableCell className="font-semibold text-forest">{collection.name}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
