import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const maxScroll = documentHeight - windowHeight;
      const scrollPercentage = (scrollTop / maxScroll) * 100;
      
      setProgress(Math.min(scrollPercentage, 100));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#007EAD] via-[#00aaff] to-[#007EAD] transition-all duration-150 ease-out shadow-lg shadow-[#00aaff]/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
