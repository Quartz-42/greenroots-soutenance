import { Product } from "@/utils/interfaces/products.interface";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex-1 w-full">
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              short_description={product.short_description ?? ""}
              price={product.price}
              imageName={
                product.Image && product.Image[0]
                  ? product.Image[0].name
                  : "/product.png"
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Aucun produit trouvé
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
