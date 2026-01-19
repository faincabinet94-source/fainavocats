"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for small teams",
    features: [
      "Up to 5 team members",
      "50GB storage",
      "Basic analytics",
      "Email support",
      "99.9% uptime SLA",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "99",
    description: "For growing businesses",
    features: [
      "Unlimited team members",
      "500GB storage",
      "Advanced analytics",
      "Priority support",
      "99.99% uptime SLA",
      "Custom integrations",
      "Advanced security",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "299",
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Unlimited storage",
      "Dedicated success manager",
      "24/7 phone support",
      "Custom SLA",
      "On-premise deployment",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Simple,{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={cn(
                  "relative h-full rounded-2xl border p-8 transition-all duration-700",
                  plan.highlighted
                    ? "border-gradient scale-105 shadow-2xl shadow-accent-blue/20"
                    : "border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/20"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-accent-blue/50 bg-gradient-to-r from-accent-blue to-accent-purple px-4 py-1 text-xs font-medium text-white">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="ml-2 text-gray-500">/month</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-blue" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
