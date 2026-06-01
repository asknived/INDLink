"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Receipt } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PLANS = [
  { id: "FREE", name: "Free", price: 0, limits: ["10 Links", "100 MB Storage", "Basic Analytics", "INDLink Branding"] },
  { id: "PRO", name: "Pro", price: 499, limits: ["Unlimited Links", "5 GB Storage", "Advanced Analytics", "Custom Themes", "QR Analytics"] },
  { id: "BUSINESS", name: "Business", price: 1499, limits: ["Unlimited Links", "25 GB Storage", "Team Features Ready", "White Label Ready", "Priority Support"] }
];

export default function BillingDashboard() {
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, fetch user's active subscription here
    setLoading(false);
  }, []);

  const handleSubscribe = async (planId: string, price: number) => {
    setProcessingId(planId);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load payment gateway");
        return;
      }

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100, type: "SUBSCRIPTION", planId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "dummy", // Should be in env
        amount: price * 100,
        currency: "INR",
        name: "INDLink",
        description: `${planId} Plan Subscription`,
        order_id: data.order.id,
        handler: async function (response: any) {
          // Verify Payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.paymentId
            })
          });

          if (verifyRes.ok) {
            alert("Subscription successful!");
            setCurrentPlan(planId);
          } else {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#000000" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert(e.message || "Failed to process payment");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription, storage limits, and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={currentPlan === plan.id ? "border-primary shadow-md relative" : ""}>
            {currentPlan === plan.id && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                CURRENT PLAN
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  {plan.price === 0 ? "Free" : `₹${plan.price}`}
                </span>
                {plan.price > 0 && <span> / month</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {plan.limits.map((limit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={currentPlan === plan.id ? "outline" : "default"}
                disabled={currentPlan === plan.id || processingId === plan.id}
                onClick={() => plan.price > 0 && handleSubscribe(plan.id, plan.price)}
              >
                {processingId === plan.id ? "Processing..." : currentPlan === plan.id ? "Active" : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-6">No previous invoices found.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-6">Managed securely via Razorpay.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
