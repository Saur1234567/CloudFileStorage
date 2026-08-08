import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import AuthShell from "./AuthShell";
import { useToast } from "../../components/Toast/ToastProvider";
import authApi from "../../api/authApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { push } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await authApi.register({
        username: name,
        email,
        password
      });

      push({
        type: "success",
        message: res.message || "Account Created Successfully"
      });

      navigate("/login");

    } catch (err) {

      push({
        type: "error",
        message:
          err.response?.data?.message ||
          "Unable to create account"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start storing and sharing files in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-aurora-violet font-medium hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="relative">
          <User
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Username"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />
        </div>

        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            className="w-full glass !bg-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center mt-1 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

      </form>
    </AuthShell>
  );
}