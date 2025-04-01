import ProductCard from "./ProductCard";

const bestSellers = [
  {
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area. Take the following figure as an example. When the height of the",
    price: 79,
    imageUrl: "/product.png"
  },
  {
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area. Take the following figure as an example. When the height of the",
    price: 79,
    imageUrl: "/product.png"
  },
  {
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area. Take the following figure as an example. When the height of the",
    price: 79,
    imageUrl: "/product.png"
  },
  {
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area. Take the following figure as an example. When the height of the",
    price: 79,
    imageUrl: "/product.png"
  }
];

export default function BestSellers() {
  return (
    <section className="bg-white pt-2 pb-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-12">Nos best-sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 