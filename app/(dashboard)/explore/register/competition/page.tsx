/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressFormLayout } from "@/app/components/progress-form-layout";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Competition Details" },
  { id: 3, title: "Rules & Requirements" },
  { id: 4, title: "Review & Submit" },
];

// Separate validation schemas for each step
const stepOneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Please select a competition type"),
});

const stepTwoSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  maxTeamSize: z.string().min(1, "Please select maximum team size"),
  prize: z.string(),
});

const stepThreeSchema = z.object({
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters"),
  rules: z.string().min(10, "Rules must be at least 10 characters"),
});

// Combined schema for the entire form
const competitionFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema);

type CompetitionFormValues = z.infer<typeof competitionFormSchema>;

export default function CompetitionRegistrationPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      maxTeamSize: "",
      prize: "",
      requirements: "",
      rules: "",
    },
  });

  // Function to validate current step
  const validateStep = async () => {
    let stepSchema;
    const values = form.getValues();

    switch (step) {
      case 1:
        stepSchema = stepOneSchema;
        break;
      case 2:
        stepSchema = stepTwoSchema;
        break;
      case 3:
        stepSchema = stepThreeSchema;
        break;
      default:
        return true;
    }

    try {
      await stepSchema.parseAsync(values);
      return true;
       
    } catch (error) {
      return false;
    }
  };

  // Handle next button click
  const handleNext = async () => {
    const isValid = await validateStep();

    if (isValid) {
      setStep(step + 1);
    } else {
      // Trigger validation on current fields
      await form.trigger();
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data: CompetitionFormValues) => {
    if (step < steps.length) {
      await handleNext();
    } else {
      try {
        const response = await fetch("/api/register/competition", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast({
            title: "Error",
            description: errorData.message || "Failed to register project.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success!",
          description: "Your project has been registered.",
        });
        router.push("/explore/competitions");
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  function renderStepContent(step: number) {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter competition name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your competition..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hackathon">Hackathon</SelectItem>
                      <SelectItem value="Ideathon">Ideathon</SelectItem>
                      <SelectItem value="Coding">Coding Competition</SelectItem>
                      <SelectItem value="Design">Design Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="maxTeamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Team Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select max team size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2">2 members</SelectItem>
                      <SelectItem value="3">3 members</SelectItem>
                      <SelectItem value="4">4 members</SelectItem>
                      <SelectItem value="5">5 members</SelectItem>
                      <SelectItem value="6">6 members</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize Details</FormLabel>
                  <FormControl>
                    <div className="flex justify-center items-center gap-1">
                      <IndianRupee size={16} />
                      <Input
                        type="number"
                        placeholder="Prize pool amount (if applicable)"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the requirements for participation..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include technical requirements, eligibility criteria, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the competition rules..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include guidelines, submission rules, judging criteria, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium">Competition Name</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("name")}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Description</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("description")}
                  </dd>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium">Type</dt>
                    <dd className="text-muted-foreground">
                      {form.getValues("type")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Max Team Size</dt>
                    <dd className="text-muted-foreground">
                      {form.getValues("maxTeamSize")} members
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="font-medium">Prize Details</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("prize")}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Requirements</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("requirements")}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Rules</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("rules")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <ProgressFormLayout steps={steps} currentStep={step}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          {renderStepContent(step)}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Draft saved",
                    description: "Your progress has been saved.",
                  });
                }}
              >
                Save Draft
              </Button>
              {step === steps.length ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </ProgressFormLayout>
  );
}
