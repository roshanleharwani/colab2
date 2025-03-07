"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <Users className="h-10 w-10" />,
    title: "Team Formation",
    description:
      "Find the perfect teammates based on skills, interests, and availability.",
  },
  {
    icon: <Code2 className="h-10 w-10" />,
    title: "Project Collaboration",
    description: "Seamlessly collaborate on projects with your team.",
  },
  {
    icon: <Rocket className="h-10 w-10" />,
    title: "Hackathon Central",
    description:
      "Discover hackathons, form teams, and showcase your projects all in one place.",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Startup Connect",
    description:
      "Connect with student startups, find co-founders, and access resources.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to collaborate
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Powerful features to help you find and work with the perfect team
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
