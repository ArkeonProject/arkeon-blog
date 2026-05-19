import { redirect } from "react-router";

export async function loader() {
  return redirect("/recursos/saas-boilerplate", 301);
}

export default function SaasBoilerplateRedirectRoute() {
  return null;
}
