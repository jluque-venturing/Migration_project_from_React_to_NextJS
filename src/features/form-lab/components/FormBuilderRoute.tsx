"use client";

import { useSearchParams } from "next/navigation";
import { FormBuilderPage } from "./FormBuilderPage";

/**
 * Wrapper client que fuerza el remount del builder cuando cambia la query
 * string (en particular `?id=`). En el original esto se hacía con
 * `useLocation().search` y `key={search}`; acá usamos `useSearchParams()`
 * de `next/navigation`.
 */
export function FormBuilderRoute() {
  const searchParams = useSearchParams();
  return <FormBuilderPage key={searchParams.toString()} />;
}
