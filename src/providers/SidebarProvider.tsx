import { useState, useEffect, useMemo, useCallback } from "react";
import { SidebarContext } from "../context/SidebarContext";

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isApplicationMenuOpen, setIsApplicationMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSidebarPersistent = localStorage.getItem("sidebarPersistent");
      if (savedSidebarPersistent !== null) {
        setIsExpanded(savedSidebarPersistent === "true");
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => {
      const newExpandedState = !prev;

      // Save to localStorage when sidebar is toggled
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarPersistent", newExpandedState.toString());
      }

      return newExpandedState;
    });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const toggleSubmenu = useCallback((item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  }, []);

  const toggleApplicationMenu = useCallback(() => {
    setIsApplicationMenuOpen((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({
      isExpanded: isMobile ? false : isExpanded,
      isMobileOpen,
      isHovered,
      activeItem,
      openSubmenu,
      isApplicationMenuOpen,
      toggleSidebar,
      toggleMobileSidebar,
      setIsHovered,
      setActiveItem,
      toggleSubmenu,
      toggleApplicationMenu,
    }),
    [
      isMobile,
      isExpanded,
      isMobileOpen,
      isHovered,
      activeItem,
      openSubmenu,
      isApplicationMenuOpen,
      toggleSidebar,
      toggleMobileSidebar,
      toggleSubmenu,
      toggleApplicationMenu,
    ]
  );

  if (!isInitialized) {
    return null;
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};
