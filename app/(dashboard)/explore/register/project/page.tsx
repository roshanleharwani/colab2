/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Project Details" },
  { id: 3, title: "Team Requirements" },
  { id: 4, title: "Review & Submit" },
];

// Separate validation schemas for each step
const stepOneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  projectType: z.string().min(1, "Please select project type"),
});

const stepTwoSchema = z.object({
  duration: z.string().min(1, "Please select estimated duration"),
  teamSize: z.string().min(1, "Please select team size"),
  techStack: z.string().min(1, "Tech stack is required"),
  githubUrl: z.string().url().optional().or(z.literal("")),
});

const stepThreeSchema = z.object({
  leaderName: z.string().min(2, "Leader name is required"),
  leaderEmail: z.string().email("Invalid email address"),
  leaderRegNumber: z.string().min(2, "Registration number is required"),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters"),
});

// Combined schema for the entire form
const projectFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .extend({
    leaderId: z.string().optional(), // Add this line
  });

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectRegistrationPage() {
  const [user, setUser] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();
  const [techStack, setTechStack] = useState<string[]>([]);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const userId = JSON.parse(loggedInUser);
      console.log(userId);
      setUser(userId);
    }
  }, []);
  useEffect(() => {
    if (user) {
      form.reset({ ...form.getValues(), leaderId: user });
    }
  }, [user]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      leaderId: user || "",
      name: "",
      description: "",
      category: "",
      duration: "",
      techStack: "",
      teamSize: "",
      leaderName: "",
      leaderEmail: "",
      leaderRegNumber: "",
      requirements: "",
      projectType: "",
      githubUrl: "",
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
  const onSubmit = async (data: ProjectFormValues) => {
    if (step < steps.length) {
      await handleNext();
    } else {
      try {
        console.log(data);
        const response = await fetch("/api/register/project", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log("after coming from backend");
        console.log(response);
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
        router.push("/explore");
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
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
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
                      placeholder="Describe your project..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear and concise description of your project, its
                    goals, and potential impact.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile App</SelectItem>
                        <SelectItem value="ai">AI/ML</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                        <SelectItem value="iot">IoT</SelectItem>
                        <SelectItem value="game">Game Development</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
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
                        <SelectItem value="academic">
                          Academic Project
                        </SelectItem>
                        <SelectItem value="personal">
                          Personal Project
                        </SelectItem>
                        <SelectItem value="startup">Startup Project</SelectItem>
                        <SelectItem value="research">
                          Research Project
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="2-3-months">2-3 Months</SelectItem>
                        <SelectItem value="3-6-months">3-6 Months</SelectItem>
                        <SelectItem value="6-plus">6+ Months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Team Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2">2 members</SelectItem>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="6-plus">6+ members</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Add technology and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value && !techStack.includes(value)) {
                              const newStack = [...techStack, value];
                              setTechStack(newStack);
                              form.setValue("techStack", newStack.join(","));
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => {
                              const newStack = techStack.filter(
                                (_, i) => i !== index
                              );
                              setTechStack(newStack);
                              form.setValue("techStack", newStack.join(","));
                            }}
                          >
                            {tech} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Press Enter to add each technology. Click on a badge to
                    remove it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repository URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    If you have already started the project, you can link the
                    repository here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="leaderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Leader Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leaderRegNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter reg. number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="leaderEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the roles and skills you're looking for..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List the roles you need to fill and any specific
                        requirements for each position. Include technical
                        skills, experience level, and time commitment
                        expectations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium">Project Name</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("name")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Description</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("description")}
                    </dd>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium">Category</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("category")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Project Type</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("projectType")}
                      </dd>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium">Duration</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("duration")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Team Size</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("teamSize")} members
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="font-medium">Tech Stack</dt>
                    <dd className="flex flex-wrap gap-2 mt-1">
                      {techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  {form.getValues("githubUrl") && (
                    <div>
                      <dt className="font-medium">GitHub Repository</dt>
                      <dd className="text-muted-foreground mt-1">
                        <a
                          href={form.getValues("githubUrl")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {form.getValues("githubUrl")}
                        </a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium">Team Leader</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("leaderName")} (
                      {form.getValues("leaderRegNumber")})
                      <br />
                      {form.getValues("leaderEmail")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Requirements</dt>
                    <dd className="text-muted-foreground mt-1 whitespace-pre-wrap">
                      {form.getValues("requirements")}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <ProgressFormLayout steps={steps} currentStep={step}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderStepContent(step)}
          <div className="flex justify-between">
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
