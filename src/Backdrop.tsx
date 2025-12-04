// src/layout/Backdrop.tsx

import { useSidebar } from "./hooks/use-sidebar";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <button
      className="fixed inset-0 z-40 !bg-black/50 dark:!bg-white/5 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
