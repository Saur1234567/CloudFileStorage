import { useState } from 'react';
import { Moon, Sun, Globe, HardDrive, LogOut, UserRound } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useDrive } from '../context/DriveContext.jsx';
import { useToast } from '../components/Toast/ToastProvider.jsx';
import { formatBytes } from '../utils/format';

const LANGUAGES = ['English', 'हिन्दी (Hindi)', 'Español', 'Français'];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useDrive();
  const { push } = useToast();
  const [language, setLanguage] = useState('English');
  const pct = Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100);

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <h1 className="font-display font-semibold text-xl">Settings</h1>

      <section className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserRound size={16} className="text-aurora-violet" />
          <p className="font-medium">Profile</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-aurora-gradient flex items-center justify-center text-lg font-semibold text-white">
            {user.avatarInitials}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-ink-faint">{user.email}</p>
            <p className="text-xs text-ink-faint">{user.role}</p>
          </div>
        </div>
      </section>

      <section className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          {theme === 'dark' ? <Moon size={16} className="text-aurora-violet" /> : <Sun size={16} className="text-aurora-amber" />}
          <p className="font-medium">Theme</p>
        </div>
        <div className="flex gap-3">
          {['dark', 'light'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                theme === t ? 'bg-aurora-gradient text-white shadow-glow' : 'bg-white/[0.05] text-ink-muted hover:text-ink'
              }`}
            >
              {t} mode
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-aurora-teal" />
          <p className="font-medium">Language</p>
        </div>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            push({ type: 'success', message: `Language set to ${e.target.value}` });
          }}
          className="w-full glass !bg-white/[0.05] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l} className="bg-void-900">
              {l}
            </option>
          ))}
        </select>
      </section>

      <section className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={16} className="text-aurora-amber" />
          <p className="font-medium">Storage</p>
        </div>
        <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden mb-2">
          <div className="h-full rounded-full bg-aurora-gradient" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-ink-faint">
          {formatBytes(user.storageUsedBytes)} of {formatBytes(user.storageLimitBytes)} used ({pct}%)
        </p>
      </section>

      <button
        onClick={() => push({ type: 'info', message: 'Signed out (demo mode)' })}
        className="glass-panel p-4 flex items-center justify-center gap-2 text-aurora-rose font-medium hover:bg-aurora-rose/5"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
