"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+234", country: "NG" },
  { code: "+91", country: "IN" },
  { code: "+27", country: "ZA" },
  { code: "+254", country: "KE" },
  { code: "+233", country: "GH" },
  { code: "+256", country: "UG" },
  { code: "+255", country: "TZ" },
];

const howHeardOptions = [
  "Twitter / X",
  "WhatsApp",
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube",
  "Friend or family",
  "Blog or article",
  "Google search",
  "Other",
];

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  country_code: z.string().min(1, "Select a country code"),
  whatsapp_number: z
    .string()
    .min(6, "Enter a valid phone number")
    .max(15, "Phone number is too long"),
  how_heard: z.string().min(1, "Tell us how you heard about us"),
  company_role: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SignupFormProps {
  referral_code?: string;
}

function SignupFormInner({ referral_code }: SignupFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const refCode = referral_code || searchParams.get("ref") || "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      country_code: "+234",
      whatsapp_number: "",
      how_heard: "",
      company_role: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.full_name,
          email: values.email,
          whatsapp_number: `${values.country_code}${values.whatsapp_number}`,
          how_heard: values.how_heard,
          company_role: values.company_role || null,
          referral_code: refCode || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Extract user-friendly error message
        const errorMessage = data.error || "Something went wrong. Please try again.";
        toast.error(errorMessage);
        setSubmitting(false);
        return;
      }

      localStorage.setItem("pantero_signed_up", "true");
      if (data.user?.referral_code) {
        localStorage.setItem("pantero_referral_code", data.user.referral_code);
      }
      if (data.user?.position) {
        localStorage.setItem("pantero_position", String(data.user.position));
      }

      toast.success("You're on the waitlist! Share your link to move up.");
      router.push("/community");
    } catch (err) {
      // Handle network errors
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 md:p-8"
    >
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">Join the Waitlist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Get early access to Pantero. No spam, ever.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <FormItem className="w-28">
                  <FormLabel>Code</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryCodes.map((cc) => (
                        <SelectItem key={cc.code} value={cc.code}>
                          {cc.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp_number"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="8012345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="how_heard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {howHeardOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company / Role (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Software Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join the Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

export default function SignupForm({ referral_code }: SignupFormProps) {
  return <SignupFormInner referral_code={referral_code} />;
}
