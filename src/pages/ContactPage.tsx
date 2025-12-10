import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "../hooks/useLocale";
import { FiMail, FiUser, FiMessageSquare, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Create mailto link with form data
    const mailtoLink = `mailto:davidlopez00@proton.me?subject=${encodeURIComponent(
      formData.subject || "Contacto desde Arkeon Blog"
    )}&body=${encodeURIComponent(
      `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;
    setStatus("sent");

    // Reset status after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 dark:from-[#0b1226] dark:via-[#071622] dark:to-[#0a172b] rounded-3xl shadow-lg dark:shadow-[#007EAD]/20 transition-colors duration-300">
      <Helmet>
        <title>{t("contact_title")} | Arkeon Blog</title>
        <meta name="description" content={t("contact_meta_description")} />
        <link rel="canonical" href="https://www.arkeontech.es/contact" />
      </Helmet>

      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] bg-clip-text text-transparent mb-4">
          {t("contact_title")}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#007EAD] to-transparent mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          {t("contact_intro")}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t("contact_form_title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("contact_name_label")}
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#007EAD] focus:border-transparent transition-all"
                  placeholder={t("contact_name_placeholder")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("contact_email_label")}
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#007EAD] focus:border-transparent transition-all"
                  placeholder={t("contact_email_placeholder")}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("contact_subject_label")}
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#007EAD] focus:border-transparent transition-all"
                placeholder={t("contact_subject_placeholder")}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("contact_message_label")}
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#007EAD] focus:border-transparent transition-all resize-none"
                  placeholder={t("contact_message_placeholder")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#007EAD] hover:bg-[#00aaff] disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors duration-300"
            >
              <FiSend />
              {status === "sending" ? t("contact_sending") : status === "sent" ? t("contact_sent") : t("contact_submit")}
            </button>
          </form>
        </section>

        {/* Contact Info */}
        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t("contact_info_title")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <div className="w-12 h-12 bg-[#007EAD]/20 rounded-full flex items-center justify-center">
                  <FiMail className="text-[#007EAD] text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("contact_email_label")}</p>
                  <a
                    href="mailto:davidlopez00@proton.me"
                    className="text-[#007EAD] hover:text-[#00aaff] font-medium transition-colors"
                  >
                    davidlopez00@proton.me
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="p-6 bg-gradient-to-r from-[#007EAD]/10 to-[#00aaff]/10 rounded-2xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t("contact_response_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("contact_response_text")}
            </p>
          </div>

          {/* FAQ Link */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t("contact_faq_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t("contact_faq_text")}
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-[#007EAD] hover:text-[#00aaff] font-medium transition-colors"
            >
              {t("contact_about_link")} →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
