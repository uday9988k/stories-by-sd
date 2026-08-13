import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Updated password strength function with detailed checks
  const getPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let text = "Weak";
    let color = "#ff4d4f";

    if (score >= 3) {
      text = "Medium";
      color = "#faad14";
    }

    if (score === 5) {
      text = "Strong";
      color = "#52c41a";
    }

    return {
      text,
      color,
      checks,
      isStrong: score === 5,
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Enter your email");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/admin/forgot-password",
        {
          email,
        },
      );

      if (res.data.success) {
        toast.success("OTP sent successfully");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:8080/api/admin/reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );

      if (res.data.success) {
        toast.success("Password changed successfully");
        navigate("/admin/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container_forgotPassword">
      <div className="forgot-box_forgotPassword">
        <h1 className="forgot-title_forgotPassword">Forgot Password</h1>

        {step === 1 ? (
          <>
            <p className="forgot-subtitle_forgotPassword">
              Enter your registered email address.
            </p>

            <form
              className="forgot-form_forgotPassword"
              onSubmit={handleSendOTP}
            >
              <input
                className="forgot-input_forgotPassword"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="forgot-button_forgotPassword"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="forgot-subtitle_forgotPassword">
              Enter the OTP and your new password.
            </p>

            <form
              className="forgot-form_forgotPassword"
              onSubmit={handleResetPassword}
            >
              <input
                className="forgot-input_forgotPassword"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <div className="password-box_forgotPassword">
                <input
                  className="forgot-input_forgotPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="password-toggle_forgotPassword"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Updated password strength display with detailed rules */}
              {newPassword && (
                <div className="password-rules_forgotPassword">
                  <p
                    style={{
                      color: passwordStrength.color,
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    Password Strength : {passwordStrength.text}
                  </p>

                  <p
                    className={
                      passwordStrength.checks.length ? "valid" : "invalid"
                    }
                  >
                    {passwordStrength.checks.length ? "✔" : "✖"} Minimum 8
                    characters
                  </p>

                  <p
                    className={
                      passwordStrength.checks.upper ? "valid" : "invalid"
                    }
                  >
                    {passwordStrength.checks.upper ? "✔" : "✖"} One uppercase
                    letter
                  </p>

                  <p
                    className={
                      passwordStrength.checks.lower ? "valid" : "invalid"
                    }
                  >
                    {passwordStrength.checks.lower ? "✔" : "✖"} One lowercase
                    letter
                  </p>

                  <p
                    className={
                      passwordStrength.checks.number ? "valid" : "invalid"
                    }
                  >
                    {passwordStrength.checks.number ? "✔" : "✖"} One number
                  </p>

                  <p
                    className={
                      passwordStrength.checks.special ? "valid" : "invalid"
                    }
                  >
                    {passwordStrength.checks.special ? "✔" : "✖"} One special
                    character
                  </p>
                </div>
              )}

              <div className="password-box_forgotPassword">
                <input
                  className="forgot-input_forgotPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="password-toggle_forgotPassword"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {confirmPassword && (
                <p
                  className="password-match_forgotPassword"
                  style={{
                    color:
                      newPassword === confirmPassword ? "#4caf50" : "#f44336",
                    marginTop: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    textAlign: "left",
                  }}
                >
                  {newPassword === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              <button
                className="forgot-button_forgotPassword"
                type="submit"
                disabled={
                  loading ||
                  !passwordStrength.isStrong ||
                  newPassword !== confirmPassword
                }
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <Link to="/admin/login" className="back-login_forgotPassword">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
