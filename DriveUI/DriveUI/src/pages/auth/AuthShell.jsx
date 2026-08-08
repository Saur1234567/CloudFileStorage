import { useState } from "react";
import AuthShell from "./AuthShell";
import authApi from "../../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await authApi.login({
        email,
        password,
      });

      localStorage.setItem("drivex-token", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Login to your DriveX account"
    >
      <form onSubmit={handleLogin}>
        {/* Email */}
        {/* Password */}
        {/* Login Button */}
      </form>
    </AuthShell>
  );
}