import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import AuthShell from "./AuthShell.jsx";
import { useToast } from "../../components/Toast/ToastProvider.jsx";
import authApi from "../../api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { push } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      push({
        type: "error",
        message: "Passwords do not match"
      });
      return;
    }

    try {
      setLoading(true);

      await authApi.resetPassword({
        email: form.email,
        password: form.password
      });

      push({
        type: "success",
        message: "Password updated successfully"
      });

      navigate("/login");
    } catch (err) {
      push({
        type: "error",
        message:
          err.response?.data?.message || "Failed to reset password"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Enter your email and choose a new password"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email Address"
          className="w-full glass !bg-white/[0.05] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
        />

        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="New Password"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />
        </div>

        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="Confirm Password"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center mt-2 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </form>
    </AuthShell>
  );
}