"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button } from "@shop-micro/shared";
import { useProducts } from "../../hooks/useProducts";
import { useDispatch } from "react-redux";
import { addToCart, syncServerCart } from "../../store/cartSlice";
import { AppDispatch } from "../../store";
import Toast from "../../components/Toast";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError } = useProducts();
  const dispatch = useDispatch<AppDispatch>();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    }));
    // Sync to Supabase immediately after adding to cart
    dispatch(syncServerCart());
    // Show success toast
    setShowToast(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Toast 
        message="Product added to cart successfully!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <h1 className="text-2xl font-semibold mb-8">Products</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load products.</p>}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.id}`}>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="line-clamp-2 min-h-[3.5rem] hover:text-blue-600 transition-colors">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="relative w-full h-48">
                    <Image src={product.image} alt={product.title} fill className="object-contain" />
                  </div>
                  <p className="mt-4 text-lg font-medium">${product.price.toFixed(2)}</p>
                </CardContent>
              </Link>
              <CardFooter className="gap-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

