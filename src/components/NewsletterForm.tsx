import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const subscribe = async () => {
    if (!email.trim()) return;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);
    if (!error) setSuccess(true);
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
        />
        <button
          onClick={subscribe}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Suscribirme
        </button>
      </div>
      {success && (
        <p className="text-green-600 mt-3">
          ¡Gracias por suscribirte! 🎉
        </p>
      )}
    </div>
  );
}