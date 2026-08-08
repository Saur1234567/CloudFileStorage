import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  Upload,
  FolderPlus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  UserRound
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useDrive } from '../context/DriveContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useToast } from './Toast/ToastProvider.jsx';
import { activityFeed } from '../data/mockData';
import { timeAgo } from '../utils/format';
import SearchBar from './Search/SearchBar.jsx';
import authApi from '../api/authApi';

const ACTIVITY_LABEL = {
  upload: 'uploaded',
  rename: 'renamed',
  share: 'shared',
  delete: 'deleted',
  move: 'moved'
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, uploadFiles, currentFolderId } = useDrive();
  const { openDialog, setMobileSidebarOpen } = useUI();
  const { push } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort: even if the server call fails, still clear the
      // local session so the user isn't stuck "logged in" on this device.
    } finally {
      localStorage.removeItem('drivex-token');
      localStorage.removeItem('user');
      push({ type: 'info', message: 'Signed out' });
      navigate('/login', { replace: true });
    }
  };

  const handleFilePick = (e) => {
    if (e.target.files?.length) {
      uploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-20 glass !rounded-none border-b border-white/[0.06] px-4 lg:px-6 py-3 flex items-center gap-3">
      <button
        className="lg:hidden text-ink-muted hover:text-ink"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <SearchBar />

      <div className="ml-auto flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFilePick}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary !py-2 !px-3.5 hidden sm:inline-flex"
        >
          <Upload size={16} />
          <span className="hidden md:inline">Upload</span>
        </button>
        <button
          onClick={() => openDialog('createFolder', { parentId: currentFolderId })}
          className="btn-ghost !py-2 !px-3"
          title="New folder"
        >
          <FolderPlus size={17} />
          <span className="hidden md:inline">New Folder</span>
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/[0.06] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-aurora-teal" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-panel p-2 z-50"
              >
                <p className="text-[11px] uppercase tracking-wide text-ink-faint px-3 py-1.5">
                  Recent activity
                </p>
                <div className="max-h-72 overflow-y-auto flex flex-col">
                  {activityFeed.map((a) => (
                    <div key={a.id} className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06]">
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-aurora-gradient shrink-0" />
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{a.user}</span>{' '}
                        {ACTIVITY_LABEL[a.type]}{' '}
                        <span className="font-medium">{a.target}</span>
                        <span className="block text-[11px] text-ink-faint mt-0.5">{timeAgo(a.time)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => {
            toggleTheme();
            push({ type: 'info', message: `${theme === 'dark' ? 'Light' : 'Dark'} mode on` });
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-aurora-gradient flex items-center justify-center text-xs font-semibold text-white">
              {user.avatarInitials}
            </div>
            <ChevronDown size={14} className="text-ink-faint hidden sm:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 glass-panel p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-[11px] text-ink-faint truncate">{user.email}</p>
                </div>
                <a href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-sm">
                  <UserRound size={15} /> Profile
                </a>
                <a href="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-sm">
                  <SettingsIcon size={15} /> Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-sm text-aurora-rose"
                >
                  <LogOut size={15} /> Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
