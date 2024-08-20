"use client";
import { Button } from "@/components/ui/button";
import { FaAddressCard, FaPhoneAlt } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters."
  }),
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});
export default function ContactPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch('api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast({
          title: 'Form submitted successfully',
          description: responseData.message,
        });
        form.reset();
      } else {
        toast({
          title: 'Error submitting form',
          description: responseData.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error submitting form',
        description: 'An error occurred while submitting the form.',
        variant: 'destructive',
      });
    }
  }

  return (
    <section className="pb-16 mb-16 mt-20 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-3xl text-center font-bold tracking-tight text-black dark:text-white sm:text-4xl">Contact</h1>
        </div>
        <div className="lg:flex flex-col p-4 lg:items-center lg:mt-20 lg:border border-gray-500 rounded-r-none pt-20 lg:py-40 rounded-xl lg:w-1/3">
          <div className="space-y-4">
            <p className="text-lg flex items-center gap-2">
              <MdAttachEmail className="text-gray-600 dark:text-gray-300" />
              <Link href="mailto:ahmy40404@gmail.com" target="_blank" className="hover:underline text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors px-4 py-2 border border-gray-600 dark:border-gray-300 rounded-md">ahmy40404@gmail.com</Link>
            </p>
            <p className="text-lg flex items-center gap-2">
              <FaPhoneAlt className="text-gray-600 dark:text-gray-300" />
              <Link href="tel:+916382429579" target="_blank" className="hover:underline text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors px-4 py-2 border border-gray-600 dark:border-gray-300 rounded-md">+91 63824 29579</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}