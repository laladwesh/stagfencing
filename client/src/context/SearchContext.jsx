import { createContext, useContext, useEffect, useState } from "react";
import SearchModal from "../components/search/SearchModal";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  // Pass the trigger element (button) so the dropdown can position itself at
  // its exact on-screen coordinates via a portal — this works regardless of
  // which Navbar copy (sticky vs normal) triggered it, since a portal to
  // document.body is immune to either copy's transform/overflow.
  const openSearch = (triggerEl) => {
    setAnchorRect(triggerEl ? triggerEl.getBoundingClientRect() : null);
    setIsOpen(true);
  };
  const closeSearch = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "/") return;
      const tag = document.activeElement?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
      if (isTyping) return;
      e.preventDefault();
      openSearch(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}
      {isOpen && <SearchModal onClose={closeSearch} anchorRect={anchorRect} />}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}
