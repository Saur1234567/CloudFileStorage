import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthShell from "./AuthShell";
import { useToast } from "../../components/Toast/ToastProvider";
import authApi from "../../api/authApi";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { push } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await authApi.forgotPassword(email);

      localStorage.setItem("reset-email", email);

      push({
        type: "success",
        message: res.message || "Verification code sent"
      });

      navigate("/otp-verification");

    } catch (err) {

      push({
        type: "error",
        message: err.response?.data?.message || "Failed to send OTP"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a verification code"
      footer={
        <Link
          to="/login"
          className="text-aurora-violet font-medium hover:underline"
        >
          Back to login
        </Link>
      }
    >

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="relative">

          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center mt-1 disabled:opacity-60"
        >
          {loading ? "Sending code..." : "Send code"}
        </button>

      </form>

    </AuthShell>
  );
}