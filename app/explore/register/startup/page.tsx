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

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Team Details" },
  { id: 3, title: "Requirements" },
  { id: 4, title: "Review & Submit" },
];

const startupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Please select an industry"),
  fundingStage: z.string().min(1, "Please select a funding stage"),
  location: z.string().min(2, "Location is required"),
  website: z.string().url().optional().or(z.literal("")),
  teamSize: z.string().min(1, "Please select team size"),
  founderName: z.string().min(2, "Founder name is required"),
  founderEmail: z.string().email("Invalid email address"),
  founderRegNumber: z.string().min(2, "Registration number is required"),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters"),
});

type StartupFormValues = z.infer<typeof startupFormSchema>;

export default function StartupRegistrationPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      industry: "",
      fundingStage: "",
      location: "",
      website: "",
      teamSize: "",
      founderName: "",
      founderEmail: "",
      founderRegNumber: "",
      requirements: "",
    },
  });

  function onSubmit(data: StartupFormValues) {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Submit the form
      toast({
        title: "Success!",
        description: "Your startup has been registered.",
      });
      router.push("/dashboard");
    }
  }

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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your startup..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-6 md:grid-cols-2">
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <FormField
              control={form.control}
              name="founderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter founder's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="founderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
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
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
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
                      <SelectItem value="1-5">1-5 members</SelectItem>
                      <SelectItem value="6-10">6-10 members</SelectItem>
                      <SelectItem value="11-20">11-20 members</SelectItem>
                      <SelectItem value="20+">20+ members</SelectItem>
                    </SelectContent>
                  </Select>
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
                    requirements for each position.
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
                  <dt className="font-medium">Startup Name</dt>
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
                    <dt className="font-medium">Industry</dt>
                    <dd className="text-muted-foreground">
                      {form.getValues("industry")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Funding Stage</dt>
                    <dd className="text-muted-foreground">
                      {form.getValues("fundingStage")}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="font-medium">Founder</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("founderName")} (
                    {form.getValues("founderRegNumber")})
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Requirements</dt>
                  <dd className="text-muted-foreground">
                    {form.getValues("requirements")}
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
              <Button type="submit">
                {step === steps.length ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </ProgressFormLayout>
  );
}
