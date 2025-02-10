"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type React from "react"; // Added import for React

interface ProgressStep {
  id: number;
  title: string;
}

interface ProgressFormLayoutProps {
  steps: ProgressStep[];
  currentStep: number;
  children: React.ReactNode;
}

export function ProgressFormLayout({
  steps,
  currentStep,
  children,
}: ProgressFormLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Progress Steps */}
      <nav aria-label="Progress" className="mb-12">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.id} className="md:flex-1">
              <div
                className={cn(
                  "group flex flex-col border rounded-lg py-2 px-4 hover:bg-muted/50 transition-colors",
                  step.id === currentStep && "border-primary",
                  step.id < currentStep && "border-muted"
                )}
              >
                <span className="text-sm font-medium">Step {step.id}</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  {step.title}
                  {step.id < currentStep && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
