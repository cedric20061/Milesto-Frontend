import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Mail, AlertCircle, ArrowLeft, User, CheckCircle } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import {
  loginUser as login,
  passwordForgotten,
  registerUser as register,
} from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resetSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resetSent, countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCompleting(true)
    try {
      let result;
      if (isLogin) {
        result = await dispatch(login({ email, password }));
      } else {
        result = await dispatch(register({ email, password, name }));
      }

      if (result.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
          setIsCompleting(false);
        }, 2000);
        navigate("/");
        document.location.reload();
      } else {
        const errorPayload = result.payload;
        setError(
          JSON.parse(errorPayload).message ||
            "An error occurred. Please try again."
        );
        setTimeout(() => {
          setIsCompleting(false);
        }, 2000);
      }
    } catch {
      setTimeout(() => {
        setIsCompleting(false);
      }, 2000);
      setError("An unexpected error occurred. Please try again.");
    }

  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetSent) {
      setResetSent(true);
      await dispatch(passwordForgotten(email));
      setShowNewPasswordField(true);
      setCountdown(60);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ email, password: newPassword }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(null);
        setIsForgotPassword(false);
        setIsLogin(true);
        navigate("/");
        document.location.reload();
      } else {
        const errorPayload = result.payload;
        setError(
          JSON.parse(errorPayload).message ||
            "An error occurred. Please try again."
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-[#FFFFFF] dark:bg-[#101422]"
    >
      <Card className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#272B3B] border-[#A8DCE7] dark:border-[#101422]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#272B3B] dark:text-[#A8DCE7]">
            {isForgotPassword
              ? "Reset Password"
              : isLogin
              ? "Login to Milesto"
              : "Create a Milesto Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            </motion.div>
          )}
          {isForgotPassword ? (
            <motion.form
              key="forgot-password"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleForgotPassword}
              className="space-y-4"
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label
                  htmlFor="reset-email"
                  className="text-[#272B3B] dark:text-[#A8DCE7]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A8DCE7] dark:text-[#272B3B]" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-[#A8DCE7] dark:border-[#272B3B] focus:border-[#272B3B] focus:ring-[#272B3B] dark:focus:border-[#A8DCE7] dark:focus:ring-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#FFFFFF]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              {showNewPasswordField && (
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label
                    htmlFor="new-password"
                    className="text-[#272B3B] dark:text-[#A8DCE7]"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A8DCE7] dark:text-[#272B3B]" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      className="pl-10 border-[#A8DCE7] dark:border-[#272B3B] focus:border-[#272B3B] focus:ring-[#272B3B] dark:focus:border-[#A8DCE7] dark:focus:ring-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#FFFFFF]"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full bg-[#A8DCE7] hover:bg-[#272B3B] text-[#101422] hover:text-[#FFFFFF] dark:bg-[#272B3B] dark:hover:bg-[#A8DCE7] dark:text-[#FFFFFF] dark:hover:text-[#101422]"
                  >
                    Login
                  </Button>
                </motion.div>
              )}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-[#A8DCE7] hover:bg-[#272B3B] text-[#101422] hover:text-[#FFFFFF] dark:bg-[#272B3B] dark:hover:bg-[#A8DCE7] dark:text-[#FFFFFF] dark:hover:text-[#101422]"
                  disabled={resetSent}
                >
                  {resetSent ? `Resend in ${countdown}s` : "Reset Password"}
                </Button>
              </motion.div>
              {resetSent && (
                <motion.p
                  className="text-sm text-[#272B3B] dark:text-[#A8DCE7] text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Reset instructions sent. Please check your email.
                </motion.p>
              )}
            </motion.form>
          ) : (
            <motion.form
              key={isLogin ? "login" : "register"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label
                    htmlFor="name"
                    className="text-[#272B3B] dark:text-[#A8DCE7]"
                  >
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A8DCE7] dark:text-[#272B3B]" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className="pl-10 border-[#A8DCE7] dark:border-[#272B3B] focus:border-[#272B3B] focus:ring-[#272B3B] dark:focus:border-[#A8DCE7] dark:focus:ring-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#FFFFFF]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              )}
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label
                  htmlFor="email"
                  className="text-[#272B3B] dark:text-[#A8DCE7]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A8DCE7] dark:text-[#272B3B]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-[#A8DCE7] dark:border-[#272B3B] focus:border-[#272B3B] focus:ring-[#272B3B] dark:focus:border-[#A8DCE7] dark:focus:ring-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#FFFFFF]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label
                  htmlFor="password"
                  className="text-[#272B3B] dark:text-[#A8DCE7]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A8DCE7] dark:text-[#272B3B]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 border-[#A8DCE7] dark:border-[#272B3B] focus:border-[#272B3B] focus:ring-[#272B3B] dark:focus:border-[#A8DCE7] dark:focus:ring-[#A8DCE7] bg-[#FFFFFF] dark:bg-[#101422] text-[#101422] dark:text-[#FFFFFF]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isCompleting}
                  className="w-full bg-[#A8DCE7] hover:bg-[#272B3B] text-[#101422] hover:text-[#FFFFFF] dark:bg-[#272B3B] dark:hover:bg-[#A8DCE7] dark:text-[#FFFFFF] dark:hover:text-[#101422]"
                >
                  {isCompleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  {isLogin ? "Login" : "Register"}
                </Button>
              </motion.div>
            </motion.form>
          )}
          <motion.div
            className="mt-4 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isForgotPassword ? (
              <button
                onClick={() => {
                  setError(null);
                  setIsForgotPassword(false);
                  setResetSent(false);
                  setShowNewPasswordField(false);
                  setCountdown(60);
                }}
                className="text-sm text-[#272B3B] dark:text-[#FFFFFF] hover:underline focus:outline-none flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </button>
            ) : (
              <>
                <span className="text-sm text-[#272B3B] dark:text-[#A8DCE7]">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <button
                  onClick={() => {
                    setError(null);
                    setIsLogin(!isLogin);
                  }}
                  className="text-sm text-[#272B3B] dark:text-[#FFFFFF] hover:underline focus:outline-none"
                >
                  
                  {isLogin ? "Sign up" : "Login"}
                </button>
                {isLogin && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setError(null);
                        setIsForgotPassword(true);
                      }}
                      className="text-sm text-[#272B3B] dark:text-[#FFFFFF] hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
