"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "src2/context/cart-context";
import { Button } from "src2/components/ui/button";
import { Input } from "src2/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src2/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src2/components/ui/form";
import { Navbar } from "src2/components";
import { Footer } from "src2/components";
import LoadingIcon from "src2/components/ui/loading-icon";

const CheckoutSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  streetAddress: z.string().min(5, "Street address is required"),
  townCity: z.string().min(3, "Town/City is required"),
  province: z.string({ required_error: "Please select a province." }),
  zipCode: z.string().min(5, "Invalid ZIP code"),
  paymentMethod: z.string({
    required_error: "Please select a payment method.",
  }),
  courier: z.string({ required_error: "Please select a courier." }),
});

type CheckoutValues = z.infer<typeof CheckoutSchema>;
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const formElementClassName =
  "bg-transparent border border-gray-300 rounded-md shadow-sm px-3 focus:ring-1 focus:ring-gray-800 focus:border-gray-800";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { items } = state;
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(CheckoutSchema),
  });
  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.product.Price * item.quantity, 0),
    [items]
  );

  const onSubmit = (data: CheckoutValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderHistory = JSON.parse(
        localStorage.getItem("orderHistory") || "[]"
      );

      const statuses = ["DELIVERED", "CANCELLED", "PENDING"];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      const newOrder = {
        orderId: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: randomStatus,
        ...data,
        items: items,
        total: subtotal,
      };
      orderHistory.push(newOrder);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
      dispatch({ type: "CLEAR_CART" });
      toast.success("Order placed successfully!");
      router.push("/profile");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <header
        className="py-8 text-center bg-cover"
        style={{ backgroundImage: "url('/images/batik-pattern.png')" }}
      >
        <div className="bg-black/50 py-4">
          <h1 className="text-4xl font-bold text-white tracking-widest">
            Checkout
          </h1>
        </div>
      </header>

      <main className="bg-[#EFE8DB] py-12 text-gray-800">
        <div className="container mx-auto px-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-16 lg:grid-cols-2"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-6">Billing details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              className={formElementClassName}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              className={formElementClassName}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input className={formElementClassName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street address</FormLabel>
                        <FormControl>
                          <Input className={formElementClassName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="townCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Town / City</FormLabel>
                        <FormControl>
                          <Input className={formElementClassName} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={formElementClassName}>
                                <SelectValue placeholder="Select Province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="east_java">
                                East Java
                              </SelectItem>
                              <SelectItem value="west_java">
                                West Java
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP code</FormLabel>
                          <FormControl>
                            <Input
                              className={formElementClassName}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-300 p-8 rounded-lg h-fit">
                <div className="space-y-4 border-b border-gray-300 pb-4">
                  <div className="flex justify-between font-semibold">
                    <p>Product</p>
                    <p>Subtotal</p>
                  </div>
                  {items.map((item) => (
                    <div
                      key={`${item.product.SKU}-${item.selectedSize}`}
                      className="flex justify-between text-sm"
                    >
                      <p className="max-w-[200px]">
                        {item.product.Name} &times; {item.quantity}
                      </p>
                      <p>
                        {formatCurrency(item.product.Price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-b border-gray-300 py-4 font-semibold">
                  <p>Subtotal</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex justify-between pt-4 font-bold text-xl">
                  <p>Total</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <div className="mt-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={formElementClassName}>
                              <SelectValue placeholder="Select Payment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank_transfer">
                              Transfer Bank
                            </SelectItem>
                            <SelectItem value="credit_card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="cod">COD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Courier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={formElementClassName}>
                              <SelectValue placeholder="Select Courier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="fast">Fast</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-8 border-2 border-gray-400 bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white rounded-md"
                >
                  {isProcessing && <LoadingIcon className="mr-2" />}
                  Place order
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </>
  );
}
