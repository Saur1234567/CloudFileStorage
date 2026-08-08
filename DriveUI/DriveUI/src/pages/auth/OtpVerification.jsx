import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { useToast } from "../../components/Toast/ToastProvider";
import authApi from "../../api/authApi";

export default function OtpVerification() {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const refs = useRef([]);
  const navigate = useNavigate();
  const { push } = useToast();

  const handleChange = (i, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...digits];
    next[i] = value;
    setDigits(next);

    if (value && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = digits.join("");

    if (otp.length !== 6) {
      push({
        type: "error",
        message: "Please enter a valid OTP",
      });
      return;
    }

    setLoading(true);

    try {
      const email = localStorage.getItem("reset-email");

      const res = await authApi.verifyOtp({
        email,
        otp,
      });

      push({
        type: "success",
        message: res.message || "OTP Verified Successfully",
      });

      navigate("/reset-password");

    } catch (err) {
      push({
        type: "error",
        message: err.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const email = localStorage.getItem("reset-email");

      const res = await authApi.resendOtp(email);

      push({
        type: "success",
        message: res.message || "OTP Sent Again",
      });

    } catch (err) {
      push({
        type: "error",
        message: err.response?.data?.message || "Unable to resend OTP",
      });
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent you"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (refs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              inputMode="numeric"
              className="w-11 h-12 text-center glass !bg-white/[0.05] rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <p className="text-center text-xs text-ink-faint">
          Didn't get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-aurora-violet hover:underline"
          >
            Resend
          </button>
        </p>

      </form>
    </AuthShell>
  );
}