import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val);

  const subscribe = async () => {
    setErrorMsg(null);
    if (!email.trim() || !isValidEmail(email)) {
      setErrorMsg("Introduce un email válido.");
      return;
    }
    setSending(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);
    if (error) {
      console.error(error);
      if (typeof error.message === "string" && error.message.toLowerCase().includes("duplicate")) {
        setErrorMsg("Este email ya está suscrito.");
      } else {
        setErrorMsg("No se pudo completar la suscripción. Intenta nuevamente.");
      }
    } else {
      setSuccess(true);
    }
    setSending(false);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl text-center shadow">
      <h2 className="text-2xl font-bold mb-2">💌 Suscríbete al Newsletter</h2>
      <p className="text-gray-600 mb-4">
        Recibe nuevos artículos y novedades directamente en tu correo.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <input
          type="email"
          placeholder="tuemail@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full sm:w-64"
          disabled={sending || success}
        />
        <button
          onClick={subscribe}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          disabled={sending || success}
        >
          {sending ? "Enviando…" : success ? "Suscrito" : "Suscribirme"}
        </button>
      </div>
      {errorMsg && <p className="text-red-600 mt-3">{errorMsg}</p>}
      {success && (
        <p className="text-green-600 mt-3">
          ¡Gracias por suscribirte! 🎉
        </p>
      )}
    </div>
  );
}