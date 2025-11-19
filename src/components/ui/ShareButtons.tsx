import { FaTwitter, FaLinkedin, FaFacebook, FaWhatsapp, FaLink } from "react-icons/fa";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const buttonClass = "p-3 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-gray-600 dark:text-white/70 text-sm font-medium mr-2">Compartir:</span>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2]`}
        aria-label="Compartir en Twitter"
      >
        <FaTwitter className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} bg-[#0077B5]/20 hover:bg-[#0077B5]/30 text-[#0077B5]`}
        aria-label="Compartir en LinkedIn"
      >
        <FaLinkedin className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2]`}
        aria-label="Compartir en Facebook"
      >
        <FaFacebook className="w-5 h-5" />
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366]`}
        aria-label="Compartir en WhatsApp"
      >
        <FaWhatsapp className="w-5 h-5" />
      </a>

      <button
        onClick={copyToClipboard}
        className={`${buttonClass} ${copied
            ? "bg-green-500/20 text-green-400"
            : "bg-[#007EAD]/20 hover:bg-[#007EAD]/30 text-[#007EAD]"
          }`}
        aria-label="Copiar enlace"
      >
        <FaLink className="w-5 h-5" />
      </button>

      {copied && (
        <span className="text-green-400 text-sm font-medium animate-fade-in">
          ¡Copiado!
        </span>
      )}
    </div>
  );
}
