import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const rawSlug = params.slug ?? "antes-de-empezar";
  const isValidSlug = /^[a-z0-9-]+$/i.test(rawSlug);
  const safeSlug = isValidSlug ? rawSlug : "antes-de-empezar";
  return redirect(`/recursos/guia-junior/capitulo/${encodeURIComponent(safeSlug)}`, 301);
}

export default function GuiaJuniorChapterRedirectRoute() {
  return null;
}
