"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "src2/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src2/components/ui/form";
import LoadingIcon from "../ui/loading-icon";

const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SignInValues = z.infer<typeof SignInSchema>;

const SignInForm = () => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful! Redirecting...");
        router.push("/");
      } else {
        console.log(JSON.stringify(result, null, 2));
        toast.info("MFA may be required.");
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage ||
        "Invalid email or password. Please try again.";
      toast.error(errorMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#3a3d5b] via-[#2c2f48] to-[#1a1c2c] p-8 text-white">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Logo-Javva.png"
            alt="Javva Logo"
            width={160}
            height={160}
          />
        </Link>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-slate-900/40 p-8 shadow-2xl backdrop-blur-sm bg-[#181B2F]">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-light">Login to your account</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Email</FormLabel>
                  <FormControl>
                    <UnderlinedInput
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-gray-400">Password</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      tabIndex={-1}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <UnderlinedInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full !mt-10"
              disabled={isLoading}
            >
              {isLoading && <LoadingIcon className="mr-2" />}
              Login now
            </Button>
          </form>
        </Form>
        <p className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t Have An Account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-white hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

const UnderlinedInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full border-0 border-b border-slate-700 bg-transparent py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:border-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
UnderlinedInput.displayName = "UnderlinedInput";

export default SignInForm;
