import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';
import LevelUpModal from './LevelUpModal';
import ToastStack from './ToastStack';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="bg-surface min-h-screen relative overflow-x-hidden">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="lg:pl-[260px] pl-0 pb-20 lg:pb-0 flex flex-col min-h-screen">
        <Topbar />
        <main className="w-full pt-24 sm:pt-28 bg-surface min-h-screen px-4 sm:px-space-lg pb-12 flex-1">
          <div className="flex flex-col w-full max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar (visible only on screens < lg) */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <LevelUpModal />
      <ToastStack />
    </div>
  );
}
