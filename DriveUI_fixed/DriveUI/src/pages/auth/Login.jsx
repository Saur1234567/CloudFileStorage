import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthShell from "./AuthShell";
import { useToast } from "../../components/Toast/ToastProvider";
import authApi from "../../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { push } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await authApi.login({
        username: email,
        password,
      });

      // Save JWT Token — backend wraps everything in { success, message, data },
      // so the actual token/user fields live under res.data, not res itself.
      localStorage.setItem("drivex-token", res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem("drivex-refresh-token", res.data.refreshToken);
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.userId,
          name: res.data.username,
          email: res.data.email,
          roles: res.data.roles
        })
      );

      push({
        type: "success",
        message: res.message || "Login Successful",
      });

      navigate("/");
    } catch (err) {
      push({
        type: "error",
        message:
          err.response?.data?.message || "Invalid Email or Password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to your drive"
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-aurora-violet font-medium hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Email */}

        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />
        </div>

        {/* Password */}

        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-xs text-ink-faint hover:text-aurora-violet"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center mt-1 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>

      </form>
    </AuthShell>
  );
}