import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader(_args: LoaderFunctionArgs) {
  return redirect("/herramientas/calculadora-salario", 302);
}

export default function CalculadoraRedirectRoute() {
  return null;
}
