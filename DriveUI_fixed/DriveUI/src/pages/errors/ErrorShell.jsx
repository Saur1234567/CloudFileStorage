import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ErrorShell({
  code,
  title,
  description,
  icon: Icon,
  buttonText = "Back to Dashboard",
  buttonLink = "/",
  retry
}) {
  return (
    <div className="min-h-screen w-full bg-void-950 bg-aurora-radial flex items-center justify-center p-6 text-center relative overflow-hidden">

      <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-aurora-violet/20 blur-[100px]" />
      <div className="absolute bottom-1/3 -right-20 w-72 h-72 rounded-full bg-aurora-teal/20 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center gap-5"
      >
        <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center">
          <Icon size={32} className="text-aurora-violet" />
        </div>

        {code && (
          <p className="font-display text-6xl font-extrabold aurora-text">
            {code}
          </p>
        )}

        <h1 className="font-display font-semibold text-xl">
          {title}
        </h1>

        <p className="text-sm text-ink-faint max-w-sm">
          {description}
        </p>

        <div className="flex gap-3">
          <Link to={buttonLink} className="btn-primary">
            {buttonText}
          </Link>

          {retry && (
            <button
              onClick={retry}
              className="btn-secondary"
            >
              Retry
            </button>
          )}
        </div>

      </motion.div>

    </div>
  );
}