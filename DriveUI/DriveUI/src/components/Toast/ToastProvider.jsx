import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

const ACCENTS = {
  success: 'text-aurora-teal',
  error: 'text-aurora-rose',
  info: 'text-aurora-violet'
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback(({ type = 'info', message, duration = 3200 }) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-[calc(100vw-3rem)] max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type] || Info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="glass rounded-xl2 px-4 py-3 flex items-center gap-3"
              >
                <Icon size={18} className={ACCENTS[toast.type]} />
                <p className="text-sm flex-1 text-ink dark:text-ink">{toast.message}</p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="text-ink-faint hover:text-ink transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
