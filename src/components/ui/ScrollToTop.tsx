import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
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
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-[#007EAD] hover:bg-[#00aaff] text-white rounded-full shadow-2xl shadow-[#007EAD]/50 hover:shadow-[#00aaff]/50 transition-all duration-300 hover:scale-110 active:scale-95 group"
                    aria-label="Scroll to top"
                >
                    <FiArrowUp className="w-6 h-6 group-hover:animate-bounce" />
                </button>
            )}
        </>
    );
}
