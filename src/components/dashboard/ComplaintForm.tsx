
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitComplaint, type SubmitComplaintPayload } from "@/actions/complaintActions";
import type { ComplaintCategory } from "@/lib/mongodb";
import { Send } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  category: z.enum(["Maintenance", "Mess", "Noise", "Security", "Harassment", "Other"], {
    required_error: "Please select a complaint category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(1000, {
    message: "Description cannot exceed 1000 characters.",
  }),
});

type ComplaintFormValues = z.infer<typeof formSchema>;

interface ComplaintFormProps {
  studentId: string;
}

const complaintCategories: ComplaintCategory[] = ["Maintenance", "Mess", "Noise", "Security", "Harassment", "Other"];

export function ComplaintForm({ studentId }: ComplaintFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      // category will be initialized by the select component
    },
  });

  async function onSubmit(data: ComplaintFormValues) {
    setIsSubmitting(true);
    const payload: SubmitComplaintPayload = {
      studentId,
      category: data.category as ComplaintCategory, // Zod enum ensures this is valid
      description: data.description,
    };

    try {
      const result = await submitComplaint(payload);
      if (result.success) {
        toast({
          title: "Complaint Submitted",
          description: result.message,
        });
        form.reset(); // Reset form fields after successful submission
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complaint Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {complaintCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complaint Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your issue in detail..."
                  className="resize-none"
                  rows={5}
                  {...field}
                  suppressHydrationWarning
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting} suppressHydrationWarning>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>
    </Form>
  );
}
