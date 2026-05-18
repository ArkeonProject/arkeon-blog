import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader(_args: LoaderFunctionArgs) {
  return redirect("/blog", 302);
}

export default function RecursosRedirectRoute() {
  return null;
}
