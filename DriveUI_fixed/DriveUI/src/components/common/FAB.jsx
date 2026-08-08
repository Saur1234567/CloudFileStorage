import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Upload, FolderPlus } from 'lucide-react';
import { useDrive } from '../../context/DriveContext.jsx';
import { useUI } from '../../context/UIContext.jsx';

export default function FAB() {
  const [open, setOpen] = useState(false);
  const { uploadFiles, currentFolderId } = useDrive();
  const { openDialog } = useUI();
  const inputRef = useRef(null);

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 flex flex-col items-end gap-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
          e.target.value = '';
          setOpen(false);
        }}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-end gap-2"
          >
            <button
              onClick={() => inputRef.current?.click()}
              className="glass-panel flex items-center gap-2 pl-4 pr-3 py-2.5 text-sm font-medium hover:bg-white/[0.08]"
            >
              Upload files <Upload size={15} className="text-aurora-teal" />
            </button>
            <button
              onClick={() => {
                openDialog('createFolder', { parentId: currentFolderId });
                setOpen(false);
              }}
              className="glass-panel flex items-center gap-2 pl-4 pr-3 py-2.5 text-sm font-medium hover:bg-white/[0.08]"
            >
              New folder <FolderPlus size={15} className="text-aurora-violet" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 45 : 0 }}
        className="w-14 h-14 rounded-full bg-aurora-gradient shadow-glow flex items-center justify-center text-white"
        aria-label="Quick actions"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
}
