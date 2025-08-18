"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button } from "shared";
import { useProducts } from "../../hooks/useProducts";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError } = useProducts();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-8">Products</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load products.</p>}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2 min-h-[3.5rem]">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="relative w-full h-48">
                  <Image src={product.image} alt={product.title} fill className="object-contain" />
                </div>
                <p className="mt-4 text-lg font-medium">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

