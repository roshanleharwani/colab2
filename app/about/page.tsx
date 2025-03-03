"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Rocket,
  Trophy,
  Lightbulb,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const stats = [
  {
    value: "1,000+",
    label: "Active Students",
    description: "Collaborating on projects",
    icon: Users,
  },
  {
    value: "200+",
    label: "Projects",
    description: "Successfully completed",
    icon: Rocket,
  },
  {
    value: "50+",
    label: "Competitions",
    description: "Organized and hosted",
    icon: Trophy,
  },
  {
    value: "20+",
    label: "Startups",
    description: "Founded by students",
    icon: Lightbulb,
  },
];

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    image: "/placeholder.svg",
    bio: "Former student with a passion for fostering innovation in education.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Sarah Chen",
    role: "Head of Operations",
    image: "/placeholder.svg",
    bio: "Experienced in building communities and managing educational programs.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Michael Patel",
    role: "Technical Lead",
    image: "/placeholder.svg",
    bio: "Full-stack developer with a focus on educational technology.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Emma Wilson",
    role: "Community Manager",
    image: "/placeholder.svg",
    bio: "Passionate about connecting students and creating opportunities.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
];

const values = [
  {
    title: "Innovation First",
    description:
      "We believe in pushing boundaries and exploring new possibilities in education and technology.",
  },
  {
    title: "Collaboration",
    description:
      "Success comes from working together and sharing knowledge across disciplines.",
  },
  {
    title: "Student-Centric",
    description:
      "Everything we do is focused on creating value and opportunities for students.",
  },
  {
    title: "Continuous Learning",
    description:
      "We encourage lifelong learning and personal growth through practical experience.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Our Mission
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                  Empowering students to innovate, collaborate, and build the
                  future. We provide the platform and resources for students to
                  turn their ideas into reality.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <stat.icon className="h-12 w-12 text-primary mb-4" />
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                        <p className="text-lg font-medium">{stat.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Our Values
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                The principles that guide our platform and community.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 space-y-4">
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Meet Our Team
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                The passionate individuals behind our platform.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 overflow-hidden rounded-full">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          width={200}
                          height={200}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {member.bio}
                      </p>
                      <div className="flex space-x-3">
                        <Link
                          href={member.social.twitter}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Twitter className="h-4 w-4" />
                        </Link>
                        <Link
                          href={member.social.linkedin}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Linkedin className="h-4 w-4" />
                        </Link>
                        <Link
                          href={member.social.github}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Github className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                Join our community of innovators and start building amazing
                projects today.
              </p>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/sign-up">Join Now</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
