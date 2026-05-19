import { redirect } from "react-router";

export async function loader() {
  return redirect("/recursos/guia-junior/gracias", 301);
}

export default function GuiaJuniorThanksRedirectRoute() {
  return null;
}
