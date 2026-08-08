import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="relative w-24 h-24 mb-5">
        <div className="absolute inset-0 rounded-full bg-aurora-gradient-soft blur-xl" />
        <div className="relative w-full h-full rounded-full glass flex items-center justify-center">
          <Icon size={34} className="text-ink-muted" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="font-display font-semibold text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-ink-faint max-w-xs mb-5">{description}</p>
      {action}
    </motion.div>
  );
}
