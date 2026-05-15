"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { customerSessionQueryKey, fetchCustomerSession } from "@/features/customer-auth/session";
import { useCartStore } from "@/stores/cartStore";

export function CartSessionSync() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const syncCustomerSession = useCartStore((state) => state.syncCustomerSession);

  const { data: customerSession, isFetched } = useQuery({
    queryKey: customerSessionQueryKey,
    queryFn: fetchCustomerSession,
    staleTime: 0,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (!hasHydrated || !isFetched) {
      return;
    }

    syncCustomerSession(customerSession?.id ?? null);
  }, [customerSession?.id, hasHydrated, isFetched, syncCustomerSession]);

  return null;
}
