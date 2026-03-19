import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 p-3.5 rounded-2xl bg-primary text-primary-foreground border border-primary/30 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-105 active:scale-95 transition-all duration-300 group ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll to top"
        >
            <FiArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </button>
    );
}
