"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  ArrowLeft,
  Check,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { use } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function ResetPassword({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Password strength requirements
  const requirements = [
    { re: /.{8,}/, label: "At least 8 characters" },
    { re: /[A-Z]/, label: "Contains uppercase letter" },
    { re: /[a-z]/, label: "Contains lowercase letter" },
    { re: /[0-9]/, label: "Contains number" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Contains special character" },
  ];

  const getStrength = (pass: string) => {
    let multiplier = 0;
    requirements.forEach((requirement) => {
      if (requirement.re.test(pass)) {
        multiplier += 1;
      }
    });
    return Math.max((multiplier * 100) / requirements.length, 0);
  };

  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);
      try {
        const response = await fetch(`/api/validate-user/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid or expired reset link");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid Reset Link",
          description:
            error instanceof Error
              ? error.message
              : "Please request a new password reset.",
        });
        router.push("/");
      } finally {
        setIsValidating(false);
      }
    };
    validateToken();
  }, [id, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same.",
      });
      return;
    }

    if (getStrength(password) !== 100) {
      toast({
        variant: "destructive",
        title: "Password too weak",
        description: "Please meet all password requirements.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/reset-password/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      toast({
        title: "Password reset successful!",
        description:
          "Your password has been updated. You can now sign in with your new password.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">BookHaven</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSuccess ? "Password Reset Complete" : "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSuccess
                ? "Your password has been successfully reset"
                : "Please enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password strength indicator */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Progress value={getStrength(password)} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Password strength: {getStrength(password)}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      {requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm"
                        >
                          {requirement.re.test(password) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              requirement.re.test(password)
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }
                          >
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !password || !confirmPassword}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully reset. You can now use
                    your new password to sign in.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/sign-in">Continue to Sign In</Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Button variant="link" asChild>
                <Link
                  href="/sign-in"
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
