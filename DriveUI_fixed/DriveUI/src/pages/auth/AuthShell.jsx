import { Orbit } from "lucide-react";

// Shared two-column layout for every auth page (Login, Register,
// ForgotPassword, OtpVerification, ResetPassword). Left side is the
// branding panel, right side is a glass card that wraps whatever form
// the page passes in as `children`.
export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen w-full flex bg-aurora-radial bg-fixed">
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-aurora-gradient-soft" />
        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="relative w-11 h-11 rounded-xl bg-aurora-gradient flex items-center justify-center shadow-glow">
              <Orbit size={22} className="text-white animate-[ringSpin_8s_linear_infinite]" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              Drive<span className="aurora-text font-extrabold">X</span>
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl leading-tight mb-3">
            Your files, elevated.
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">
            Store, organize, and share everything in one fast, secure place —
            built for people who move quickly.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="relative w-9 h-9 rounded-xl bg-aurora-gradient flex items-center justify-center shadow-glow">
              <Orbit size={19} className="text-white animate-[ringSpin_8s_linear_infinite]" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Drive<span className="aurora-text font-extrabold">X</span>
            </span>
          </div>

          <div className="glass-panel p-7 sm:p-9">
            <h2 className="font-display font-bold text-2xl mb-1.5">{title}</h2>
            {subtitle && <p className="text-ink-muted text-sm mb-6">{subtitle}</p>}

            {children}

            {footer && (
              <p className="text-sm text-ink-muted text-center mt-6">{footer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
