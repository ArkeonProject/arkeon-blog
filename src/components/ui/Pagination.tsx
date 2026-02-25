import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className={`flex items-center justify-center gap-1.5 ${className}`.trim()}
            aria-label="Pagination"
        >
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl text-gray-500 dark:text-white/50 hover:bg-[#007EAD]/10 hover:text-[#007EAD] dark:hover:text-[#00aaff] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Previous page"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            {pageNumbers.map((page, idx) =>
                page === "..." ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-gray-400 dark:text-white/30 select-none"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${page === currentPage
                                ? "bg-gradient-to-r from-[#007EAD] to-[#00aaff] text-white shadow-md shadow-[#007EAD]/30"
                                : "text-gray-600 dark:text-white/60 hover:bg-[#007EAD]/10 hover:text-[#007EAD] dark:hover:text-[#00aaff]"
                            }`}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl text-gray-500 dark:text-white/50 hover:bg-[#007EAD]/10 hover:text-[#007EAD] dark:hover:text-[#00aaff] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Next page"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
}
