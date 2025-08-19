"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@shop-micro/shared";
import { useProduct } from "@/hooks/useProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";
import { AppDispatch } from "../../../store";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const { data: product, isLoading, isError } = useProduct(productId);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg text-red-600">Failed to load product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative w-full h-96 lg:h-[500px]">
            <Image 
              src={product.image} 
              alt={product.title} 
              fill 
              className="object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-semibold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Category
              </h3>
              <p className="text-gray-600 capitalize">
                {product.category}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full lg:w-auto px-8 py-3 text-lg"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
