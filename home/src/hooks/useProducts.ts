"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "../api/products";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 60_000 });
}

export function useProduct(productId: number) {
  return useQuery({ queryKey: ["products", productId], queryFn: () => fetchProductById(productId), enabled: !!productId, staleTime: 60_000 });
}


