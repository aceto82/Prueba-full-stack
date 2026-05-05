'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

type Filters = Record<string, string>;

export function useFilterParams(keys: string[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keysRef = useRef(keys);

  const [filters, setFiltersState] = useState<Filters>(() =>
    Object.fromEntries(keysRef.current.map((k) => [k, searchParams.get(k) ?? '']))
  );

  const setFilters = useCallback(
    (next: Filters) => {
      setFiltersState(next);
      const params = new URLSearchParams(searchParams.toString());
      keysRef.current.forEach((k) => params.delete(k));
      Object.entries(next).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  return { filters, setFilters };
}
