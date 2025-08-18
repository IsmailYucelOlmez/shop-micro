export async function fetchProducts(): Promise<Product[]> {
    try {
        
        const response = await fetch("https://fakestoreapi.com/products");
        
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return response.json();

    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch products");
    }
}

export async function fetchProductById(productId: number): Promise<Product> {
    try {

        if (!productId) {
            throw new Error("Product ID is required");
        }

        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        return response.json();
        
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch product");
  }
}


