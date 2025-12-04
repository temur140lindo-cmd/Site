// src/layout/AppSidebar.tsx
import React from "react";
import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router";

import { useSidebar } from "./hooks/use-sidebar";

type NavItem = {
  name: string;
  path: string;
};

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    isApplicationMenuOpen,
    toggleSidebar,
  } = useSidebar();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Calendar",
      path: "/calendar",
    },
    {
      name: "Mentee",
      path: "/mentee",
    },
    {
      name: "Chat",
      path: "/chat",
    },
  ];

  const isActive = useCallback(
    (path: string) => {
      if (path === "/dashboard") {
        return location.pathname === "/" || location.pathname === "/dashboard";
      }
      return location.pathname === path;
    },
    [location.pathname]
  );

  const computedStyles = useMemo(() => {
    const isCollapsed = !isExpanded && !isHovered;
    const showText = isExpanded || isHovered || isMobileOpen;
    const justifyClass = isCollapsed ? "lg:justify-center" : "lg:justify-start";
    let headerHeight = 0;
    if (isMobileOpen) {
      headerHeight = isApplicationMenuOpen ? 140 : 65;
    }

    return {
      isCollapsed,
      showText,
      justifyClass,
      headerHeight,
      sidebarWidth:
        isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]",
      sidebarTransform: isMobileOpen ? "translate-x-0" : "-translate-x-full",
    };
  }, [isExpanded, isHovered, isMobileOpen, isApplicationMenuOpen]);

  const getMenuItemClass = useCallback(
    (path: string) => {
      const baseClass = `menu-item group`;
      const activeClass = isActive(path)
        ? "menu-item-active"
        : "menu-item-inactive";
      return `${baseClass} ${activeClass} ${computedStyles.justifyClass}`;
    },
    [isActive, computedStyles.justifyClass]
  );

  const getMenuItemIconClass = useCallback(
    (path: string) => {
      const baseClass = "menu-item-icon-size";
      const activeClass = isActive(path)
        ? "menu-item-icon-active"
        : "menu-item-icon-inactive";
      return `${baseClass} ${activeClass}`;
    },
    [isActive]
  );

  const renderLogo = () => {
    if (computedStyles.showText) {
      return (
        <div className="flex items-center justify-between w-full">
          <Link
            to="/"
            className="flex w-10 h-10 items-center justify-center rounded-lg"
          >
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={24}
              height={24}
              className="size-6"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="relative flex w-10 h-10 items-center justify-center rounded-lg text-theme-sm menu-item-inactive"
          >
            <span className="menu-item-icon-size menu-item-icon-inactive"></span>
          </button>
        </div>
      );
    }

    return (
      <div className="group flex items-center justify-center">
        <Link
          to="/"
          className="group-hover:hidden flex w-10 h-10 items-center justify-center rounded-lg"
        >
          <img
            src="/images/logo/logo-icon.svg"
            alt="Logo"
            width={24}
            height={24}
            className="size-6"
          />
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden group-hover:flex w-10 h-10 items-center justify-center rounded-lg menu-item-inactive"
        >
          <span className="menu-item-icon-size menu-item-icon-inactive"></span>
        </button>
      </div>
    );
  };

  const renderMenuHeader = () => (
    <h2
      className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${computedStyles.justifyClass}`}
    ></h2>
  );

  const renderNavItem = (nav: NavItem) => (
    <li key={nav.name}>
      <Link to={nav.path} className={getMenuItemClass(nav.path)}>
        <span className={getMenuItemIconClass(nav.path)}></span>
        {computedStyles.showText && (
          <span className="menu-item-text">{nav.name}</span>
        )}
      </Link>
    </li>
  );

  return (
    <aside
      className={`fixed flex flex-col px-5 left-0 bg-ms-surface-light dark:bg-ms-surface-dark dark:border-ms-gray-950 text-gray-900 transition-all duration-300 ease-in-out z-99999 border-r border-ms-gray-50
        ${computedStyles.sidebarWidth}
        ${computedStyles.sidebarTransform}
        lg:translate-x-0`}
      style={{
        top: `${computedStyles.headerHeight}px`,
        height: `calc(100vh - ${computedStyles.headerHeight}px)`,
      }}
    >
      {!isMobileOpen && (
        <div className={`py-8 flex ${computedStyles.justifyClass}`}>
          {renderLogo()}
        </div>
      )}

      <div
        className={`flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar ${
          isMobileOpen ? "pt-6" : ""
        }`}
      >
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuHeader()}
              <ul className="flex flex-col gap-4 px-1">
                {navItems.map(renderNavItem)}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
