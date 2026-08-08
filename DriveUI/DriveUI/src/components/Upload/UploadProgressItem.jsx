import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X, RotateCcw, FileUp } from 'lucide-react';
import { useDrive } from '../../context/DriveContext.jsx';

export default function UploadManager() {
  const { uploadQueue, dismissUpload, retryUpload } = useDrive();
  if (uploadQueue.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[95] w-80 max-w-[calc(100vw-3rem)]">
      <div className="glass-panel overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
          <FileUp size={14} className="text-aurora-violet" />
          <span className="text-xs font-medium">
            Uploading {uploadQueue.filter((u) => u.status === 'uploading').length || uploadQueue.length} file(s)
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <AnimatePresence>
            {uploadQueue.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs truncate flex-1">{item.name}</span>
                  {item.status === 'done' && <CheckCircle2 size={14} className="text-aurora-teal shrink-0" />}
                  {item.status === 'error' && (
                    <button onClick={() => retryUpload(item.id)} className="text-aurora-amber shrink-0">
                      <RotateCcw size={13} />
                    </button>
                  )}
                  <button onClick={() => dismissUpload(item.id)} className="text-ink-faint hover:text-ink shrink-0">
                    <X size={13} />
                  </button>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <motion.div
                    animate={{ width: `${item.progress}%` }}
                    transition={{ ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      item.status === 'error' ? 'bg-aurora-rose' : 'bg-aurora-gradient'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
