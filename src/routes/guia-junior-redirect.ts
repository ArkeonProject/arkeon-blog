import { redirect } from "react-router";

export async function loader() {
  return redirect("/recursos/guia-junior", 301);
}

export default function GuiaJuniorRedirectRoute() {
  return null;
}
