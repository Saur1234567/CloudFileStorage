import { motion } from 'framer-motion';
import { useDrive } from '../context/DriveContext.jsx';
import StatsCards from '../components/Dashboard/StatsCards.jsx';
import StorageChart from '../components/Dashboard/StorageChart.jsx';
import UsageAreaChart from '../components/Dashboard/UsageAreaChart.jsx';
import ActivityTimeline from '../components/Dashboard/ActivityTimeline.jsx';
import { StatCardSkeleton } from '../components/common/Skeletons.jsx';

export default function DashboardPage() {
  const { files, folders, isLoading, user } = useDrive();
  const activeFiles = files.filter((f) => !f.trashed);
  const activeFolders = folders.filter((f) => !f.trashed);
  const recentUploads = activeFiles.filter(
    (f) => Date.now() - new Date(f.createdAt).getTime() < 7 * 86400000
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-semibold text-2xl">
          Welcome back, <span className="aurora-text">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-ink-faint mt-1">Here's what's happening across your drive today.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <StatsCards
          totalFiles={activeFiles.length}
          totalFolders={activeFolders.length}
          storageUsed={user.storageUsedBytes}
          storageLimit={user.storageLimitBytes}
          recentUploads={recentUploads}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UsageAreaChart />
        <StorageChart files={activeFiles} />
      </div>

      <ActivityTimeline />
    </div>
  );
}
