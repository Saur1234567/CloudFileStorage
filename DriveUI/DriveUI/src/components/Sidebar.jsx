import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  HardDrive,
  Clock,
  Users,
  Star,
  Trash2,
  Search as SearchIcon,
  Settings,
  Orbit
} from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import { formatBytes } from '../utils/format';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/drive', label: 'My Drive', icon: HardDrive },
  { to: '/recent', label: 'Recent Files', icon: Clock },
  { to: '/shared', label: 'Shared Files', icon: Users },
  { to: '/starred', label: 'Starred', icon: Star },
  { to: '/trash', label: 'Trash', icon: Trash2 },
  { to: '/search', label: 'Search', icon: SearchIcon },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useDrive();
  const pct = Math.min(100, Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100));

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-[264px] shrink-0 glass !rounded-none lg:!rounded-r-xl3 border-r border-white/[0.06] flex flex-col p-5 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2.5 px-1 mb-8">
          <div className="relative w-9 h-9 rounded-xl bg-aurora-gradient flex items-center justify-center shadow-glow">
            <Orbit size={19} className="text-white animate-[ringSpin_8s_linear_infinite]" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Drive<span className="aurora-text font-extrabold">X</span>
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-aurora-gradient shadow-glow'
                    : 'text-ink-muted hover:text-ink hover:bg-white/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} strokeWidth={2.2} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 mt-4 border-t border-white/[0.06] flex flex-col gap-3">
          <div className="px-1">
            <div className="flex justify-between text-xs text-ink-muted mb-1.5">
              <span>Storage</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-aurora-gradient"
              />
            </div>
            <p className="text-[11px] text-ink-faint mt-1.5">
              {formatBytes(user.storageUsedBytes)} of {formatBytes(user.storageLimitBytes)} used
            </p>
          </div>

          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-aurora-gradient flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {user.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-[11px] text-ink-faint truncate">{user.role}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
