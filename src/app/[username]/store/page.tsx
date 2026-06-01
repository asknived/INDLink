import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default async function StorePage({ params }: { params: { username: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: {
      products: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!profile) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        
        {/* Store Header */}
        <div className="text-center mb-12">
          {profile.avatar && (
            <img src={profile.avatar} alt={profile.displayName} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-background shadow-lg" />
          )}
          <h1 className="text-4xl font-bold tracking-tight mb-2">{profile.displayName}'s Store</h1>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.products.map(product => (
            <Link key={product.id} href={`/${profile.username}/product/${product.slug}`}>
              <Card className="hover:border-primary/50 transition-colors overflow-hidden h-full flex flex-col">
                <div className="aspect-video bg-muted relative">
                  {product.coverImage ? (
                    <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg">₹{(product.price / 100).toLocaleString()}</span>
                    <Button variant="secondary" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {profile.products.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products available at the moment.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
