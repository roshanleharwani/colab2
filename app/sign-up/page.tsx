"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/app/components/navbar";
interface FormData {
  name: string;
  email: string;
  phone: string;
  degree: string;
  registration_number: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  degree: "",
  registration_number: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  function next() {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  }

  function back() {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < totalSteps) {
      next();
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    // Handle final submission here
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Account created successfully.");

        router.push("/sign-in");
      } else if (response.status === 409) {
        toast.error("User already exists.");
        setIsLoading(false);
        return;
      } else {
        toast.error("An error occurred. Please try again later.");
        setIsLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <Card className="w-full max-w-md relative z-10">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-6">
              <Link href="/" className="flex items-center space-x-2">
                <Code2 className="h-8 w-8" />
                <span className="font-bold text-2xl">Collab Campus</span>
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Step {step} of {totalSteps}
            </CardDescription>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={data.name}
                        onChange={(e) => updateFields({ name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">College Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@college.edu"
                        value={data.email}
                        onChange={(e) =>
                          updateFields({ email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={data.phone}
                        onChange={(e) =>
                          updateFields({ phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree Program</Label>
                      <Input
                        id="degree"
                        placeholder="B.Tech Computer Science"
                        value={data.degree}
                        onChange={(e) =>
                          updateFields({ degree: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regNumber">Registration Number</Label>
                      <Input
                        id="regNumber"
                        placeholder="2021CS001"
                        value={data.registration_number}
                        onChange={(e) =>
                          updateFields({ registration_number: e.target.value })
                        }
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) =>
                          updateFields({ password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={data.confirmPassword}
                        onChange={(e) =>
                          updateFields({ confirmPassword: e.target.value })
                        }
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex gap-4 w-full">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={back}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Creating account..."
                    : step === totalSteps
                    ? "Create account"
                    : "Next"}
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
