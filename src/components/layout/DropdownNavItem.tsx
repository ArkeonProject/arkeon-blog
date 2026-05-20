import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface DropdownSubLink {
  path: string;
  label: string;
}

interface DropdownNavItemProps {
  label: string;
  mainPath: string;
  subLinks: DropdownSubLink[];
  isActive: boolean;
}

export default function DropdownNavItem({
  label,
  mainPath,
  subLinks,
  isActive,
}: DropdownNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = `dropdown-menu-${mainPath.replace(/^\//, "").replace(/\//g, "-")}`;

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimeout();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 240);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && containerRef.current?.contains(nextTarget)) {
      return;
    }
    scheduleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={handleMouseLeave}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && containerRef.current?.contains(nextTarget)) {
          return;
        }
        setIsOpen(false);
      }}
    >
      <div
        className={`relative inline-flex items-center rounded-lg transition-all duration-300 ${
          isActive
            ? "text-primary bg-primary/8"
            : "text-muted-foreground hover:text-foreground hover:bg-surface"
        }`}
      >
        <Link
          to={mainPath}
          onFocus={openMenu}
          className="px-3.5 py-1.5 pr-1 text-[13px] font-medium"
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          className="py-1.5 pl-1 pr-2.5"
          aria-label={`${label} submenu`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
        >
          <FiChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
        )}
      </div>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
          onMouseEnter={openMenu}
          onMouseLeave={handleMouseLeave}
        >
          <div className="rounded-xl border border-border/60 surface-elevated p-1.5 animate-reveal">
            {subLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                role="menuitem"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:bg-muted/50 focus-visible:text-foreground"
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-70">-&gt;</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
