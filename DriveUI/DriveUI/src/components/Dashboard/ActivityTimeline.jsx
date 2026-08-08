import { motion } from 'framer-motion';
import { UploadCloud, Pencil, Share2, Trash2, FolderInput } from 'lucide-react';
import { activityFeed } from '../../data/mockData';
import { timeAgo } from '../../utils/format';

const ACTIVITY_META = {
  upload: { icon: UploadCloud, color: '#43d9c8', label: 'uploaded' },
  rename: { icon: Pencil, color: '#8b7cfa', label: 'renamed' },
  share: { icon: Share2, color: '#5b9dfa', label: 'shared' },
  delete: { icon: Trash2, color: '#fa7c9c', label: 'deleted' },
  move: { icon: FolderInput, color: '#ffb86b', label: 'moved' }
};

export default function ActivityTimeline() {
  return (
    <div className="glass-panel p-5">
      <p className="font-display font-semibold mb-4">Recent Activity</p>
      <div className="flex flex-col">
        {activityFeed.map((a, i) => {
          const meta = ACTIVITY_META[a.type];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 pb-4 last:pb-0 relative"
            >
              {i !== activityFeed.length - 1 && (
                <span className="absolute left-[15px] top-8 bottom-0 w-px bg-white/[0.08]" />
              )}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
                style={{ background: `${meta.color}22` }}
              >
                <meta.icon size={14} style={{ color: meta.color }} />
              </div>
              <div className="text-sm">
                <p>
                  <span className="font-medium">{a.user}</span> {meta.label}{' '}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-[11px] text-ink-faint mt-0.5">{timeAgo(a.time)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
