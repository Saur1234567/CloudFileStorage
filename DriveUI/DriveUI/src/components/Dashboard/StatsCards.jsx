import { motion } from 'framer-motion';
import { Files, FolderKanban, HardDrive, UploadCloud } from 'lucide-react';
import { formatBytes } from '../../utils/format';

export default function StatsCards({ totalFiles, totalFolders, storageUsed, storageLimit, recentUploads }) {
  const cards = [
    { label: 'Total Files', value: totalFiles, icon: Files, accent: 'from-aurora-violet to-aurora-violet/60' },
    { label: 'Total Folders', value: totalFolders, icon: FolderKanban, accent: 'from-aurora-teal to-aurora-teal/60' },
    { label: 'Storage Used', value: formatBytes(storageUsed), sub: `of ${formatBytes(storageLimit)}`, icon: HardDrive, accent: 'from-aurora-amber to-aurora-amber/60' },
    { label: 'Recent Uploads', value: recentUploads, sub: 'last 7 days', icon: UploadCloud, accent: 'from-aurora-rose to-aurora-rose/60' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -3 }}
          className="glass-panel p-5 relative overflow-hidden"
        >
          <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-xl`} />
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3 relative">
            <c.icon size={17} className="text-ink" />
          </div>
          <p className="text-2xl font-display font-semibold leading-none">{c.value}</p>
          <p className="text-xs text-ink-faint mt-1.5">
            {c.label} {c.sub && <span className="text-ink-faint/70">· {c.sub}</span>}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
