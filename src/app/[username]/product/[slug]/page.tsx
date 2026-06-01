"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProductPage({ params }: { params: { username: string, slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    // Mock fetch. In reality, fetch from API.
    setProduct({
      id: "prod_1",
      title: "Complete Next.js Template",
      description: "A production-ready SaaS template built with Next.js 15, Tailwind, and Prisma. Includes authentication, billing, and a complete dashboard.",
      price: 49900, // ₹499.00
      coverImage: null
    });
    setLoading(false);
  }, []);

  const handleBuy = async () => {
    setProcessing(true);
    try {
      // 1. Load Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      await new Promise((res) => script.onload = res);

      // 2. Create Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: product.price, type: "PRODUCT", productId: product.id })
      });
      const orderData = await orderRes.json();

      // 3. Open Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "dummy",
        amount: product.price,
        currency: "INR",
        name: params.username,
        description: product.title,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // 4. Verify
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              paymentId: orderData.paymentId,
              metadata: { productId: product.id }
            })
          });

          if (verifyRes.ok) {
            setHasPurchased(true);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (e) {
      alert("Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/products/download?productId=${product.id}`);
      const data = await res.json();
      if (res.ok && data.downloadUrl) {
        window.location.href = data.downloadUrl;
      } else {
        alert("Download failed. Make sure you are logged in.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-xl border flex items-center justify-center overflow-hidden">
            {product.coverImage ? (
              <img src={product.coverImage} className="w-full h-full object-cover" />
            ) : (
              <ShoppingCart className="h-20 w-20 text-muted-foreground/30" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{product.title}</h1>
            <div className="text-3xl font-bold text-primary mb-6">
              ₹{(product.price / 100).toLocaleString()}
            </div>
            
            <p className="text-muted-foreground mb-8 text-lg">
              {product.description}
            </p>

            {hasPurchased ? (
              <div className="space-y-4 bg-green-500/10 p-6 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  Purchase Successful
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg" onClick={handleDownload}>
                  <Download className="mr-2 h-5 w-5" /> Download Product
                </Button>
              </div>
            ) : (
              <Button size="lg" className="w-full text-lg h-14" onClick={handleBuy} disabled={processing}>
                {processing ? "Processing..." : "Buy Now"}
              </Button>
            )}
            
            <div className="mt-8 text-sm text-muted-foreground border-t pt-6">
              <p>Secure payments via Razorpay.</p>
              <p>Instant digital download delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
