import { redirect } from "react-router";

export async function loader() {
  return redirect("/herramientas/calculadora-salario", 302);
}

export default function CalculadoraRedirectRoute() {
  return null;
}
