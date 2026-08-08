import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { useDrive } from '../../context/DriveContext.jsx';

export default function UploadDropzone({ children }) {
  const { uploadFiles } = useDrive();
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  const onDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer?.types?.includes('Files')) setDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) setDragging(false);
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative min-h-[60vh]"
    >
      {children}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-void-950/70 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass-panel border-2 border-dashed border-aurora-violet/60 px-16 py-14 flex flex-col items-center gap-4"
            >
              <UploadCloud size={40} className="text-aurora-violet" />
              <p className="font-display font-semibold text-lg">Drop files to upload</p>
              <p className="text-sm text-ink-faint">Release to add them to this folder</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
