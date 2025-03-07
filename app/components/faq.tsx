"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I find projects to join?",
    answer:
      "Browse through our projects page where students post their ideas and opportunities. You can filter by skills needed, project type, and commitment level to find the perfect match.",
  },
  {
    question: "Can I post my own project?",
    answer:
      "Yes! Once you create an account, you can post your project idea and specify the types of collaborators you're looking for. It's a great way to build your team.",
  },
  {
    question: "How do hackathons work on the platform?",
    answer:
      "We list upcoming hackathons with all the important details. You can register, form or join teams, and coordinate with your teammates directly through our platform.",
  },
  {
    question: "What about startups?",
    answer:
      "We provide resources including mentorship connections, funding opportunities, and workshops. You can also connect with other student entrepreneurs and potential co-founders.",
  },
];

export default function Faq() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Everything you need to know about the platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
