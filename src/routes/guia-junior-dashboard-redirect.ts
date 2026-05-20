import { redirect } from "react-router";

export async function loader() {
  return redirect("/recursos/guia-junior/dashboard", 301);
}

export default function GuiaJuniorDashboardRedirectRoute() {
  return null;
}
