"use client"

import { motion } from "framer-motion"

export default function About() {
  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
              <div className="relative h-full rounded-3xl border bg-muted/50 p-8">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="grid gap-4">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <div className="font-bold">200+</div>
                      <div className="text-sm text-muted-foreground">Projects</div>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-4">
                      <div className="font-bold">50+</div>
                      <div className="text-sm text-muted-foreground">Hackathons</div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <div className="font-bold">1000+</div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-4">
                      <div className="font-bold">20+</div>
                      <div className="text-sm text-muted-foreground">Startups</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Empowering Student Innovation
            </h2>
            <p className="text-muted-foreground md:text-lg">
              We believe in the power of collaboration. Our platform brings together talented students from across
              campus, making it easier than ever to find the perfect team for your next big idea.
            </p>
            <ul className="grid gap-4">
              <li className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Connect with like-minded students</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Build impressive portfolio projects</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Launch your startup journey</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

