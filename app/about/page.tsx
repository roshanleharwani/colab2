"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/app/components/navbar";
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
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-5 md:py-10 lg:py-12 bg-muted">
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
                    future. We provide the platform and resources for students
                    to turn their ideas into reality.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="w-full py-5 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Our Values
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground">
                  The principles that guide our platform and community.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-5 md:py-10 lg:py-12 bg-muted">
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
    </>
  );
}
