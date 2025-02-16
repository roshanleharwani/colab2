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
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Startup Details" },
  { id: 3, title: "Team & Requirements" },
  { id: 4, title: "Review & Submit" },
];

// Separate validation schemas for each step
const stepOneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().min(5, "Tagline must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Please select an industry"),
});

const stepTwoSchema = z.object({
  fundingStage: z.string().min(1, "Please select funding stage"),
  founded: z.string().min(1, "Founded year is required"),
  location: z.string().min(2, "Location is required"),
  website: z.string().url().optional().or(z.literal("")),
  metrics: z.object({
    users: z.string().optional(),
    growth: z.string().optional(),
    institutions: z.string().optional(),
  }),
});

const stepThreeSchema = z.object({
  maxTeamSize: z.string().min(1, "Please select team size"),
  founderName: z.string().min(2, "Founder name is required"),
  founderEmail: z.string().email("Invalid email address"),
  founderRegNumber: z.string().min(2, "Registration number is required"),
  founderRole: z.string().min(2, "Founder role is required"),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters"),
});

// Combined schema for the entire form
const startupFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema);

type StartupFormValues = z.infer<typeof startupFormSchema>;

export default function StartupRegistrationPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      industry: "",
      fundingStage: "",
      founded: "",
      location: "",
      website: "",
      metrics: {
        users: "",
        growth: "",
        institutions: "",
      },
      maxTeamSize: "",
      founderName: "",
      founderEmail: "",
      founderRegNumber: "",
      founderRole: "",
      requirements: "",
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const onSubmit = async (data: StartupFormValues) => {
    if (step < steps.length) {
      await handleNext();
    } else {
      // Final submission
      toast({
        title: "Success!",
        description: "Your startup has been registered.",
      });
      console.log("Form data:", data);
      router.push("/explore/startups");
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
                  <FormLabel>Startup Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your startup name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a catchy tagline" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short, memorable phrase that describes your startup
                  </FormDescription>
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
                      placeholder="Describe your startup..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear and concise description of your startup, its
                    mission, and vision.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="health">Healthcare</SelectItem>
                      <SelectItem value="edu">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce</SelectItem>
                      <SelectItem value="sustainability">
                        Sustainability
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                name="fundingStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Stage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ideation">Ideation</SelectItem>
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Key Metrics (Optional)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="metrics.users"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Active Users</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1,000+" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metrics.growth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Growth</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 20% MoM" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metrics.institutions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner Institutions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 5+" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <h3 className="font-medium">Founder Information</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="founderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="founderRegNumber"
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
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="founderEmail"
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
                    <FormField
                      control={form.control}
                      name="founderRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., CEO & Co-founder"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <SelectItem value="5">Up to 5 members</SelectItem>
                      <SelectItem value="10">Up to 10 members</SelectItem>
                      <SelectItem value="15">Up to 15 members</SelectItem>
                      <SelectItem value="20">Up to 20 members</SelectItem>
                      <SelectItem value="20+">20+ members</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    requirements for each position. Include technical skills,
                    experience level, and time commitment expectations.
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
            <Card>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium">Startup Name</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("name")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Tagline</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("tagline")}
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
                      <dt className="font-medium">Industry</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("industry")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Funding Stage</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("fundingStage")}
                      </dd>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium">Founded</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("founded")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Location</dt>
                      <dd className="text-muted-foreground mt-1">
                        {form.getValues("location")}
                      </dd>
                    </div>
                  </div>
                  {form.getValues("website") && (
                    <div>
                      <dt className="font-medium">Website</dt>
                      <dd className="text-muted-foreground mt-1">
                        <a
                          href={form.getValues("website")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {form.getValues("website")}
                        </a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium">Key Metrics</dt>
                    <dd className="grid md:grid-cols-3 gap-4 mt-2">
                      {form.getValues("metrics.users") && (
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-sm text-muted-foreground">
                            Active Users
                          </div>
                          <div className="font-medium mt-1">
                            {form.getValues("metrics.users")}
                          </div>
                        </div>
                      )}
                      {form.getValues("metrics.growth") && (
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-sm text-muted-foreground">
                            Monthly Growth
                          </div>
                          <div className="font-medium mt-1">
                            {form.getValues("metrics.growth")}
                          </div>
                        </div>
                      )}
                      {form.getValues("metrics.institutions") && (
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-sm text-muted-foreground">
                            Partner Institutions
                          </div>
                          <div className="font-medium mt-1">
                            {form.getValues("metrics.institutions")}
                          </div>
                        </div>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Founder</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("founderName")} (
                      {form.getValues("founderRegNumber")})
                      <br />
                      {form.getValues("founderRole")}
                      <br />
                      {form.getValues("founderEmail")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Maximum Team Size</dt>
                    <dd className="text-muted-foreground mt-1">
                      {form.getValues("maxTeamSize")} members
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
