import { CartItem } from "@/context/CartContext";
import ProductCheckout from "../products/ProductCheckout";
import { Button } from "../ui/button";

interface RecapitulatifProps {
  cartItems: CartItem[];
  roundedSubtotal: string | number;
  roundedTva: string | number;
  roundedTotal: string | number;
  loading: boolean;
  formValid: boolean;
  handleSubmit: (e: any) => Promise<void>;
}

function Recapitulatif({
  cartItems,
  roundedSubtotal,
  roundedTva,
  roundedTotal,
  loading,
  formValid,
  handleSubmit,
}: RecapitulatifProps) {
  return (
    <div>
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>

        <div className="divide-y">
          {cartItems.map((product) => (
            <ProductCheckout
              key={product.id}
              title={product.title ?? "Produit sans titre"}
              description={product.description ?? ""}
              price={product.price ?? 0}
              quantity={product.quantity}
              imageName={product.imageName ?? "/placeholder.webp"}
            />
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span>Total</span>
            <span>{roundedSubtotal}€</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>TVA</span>
            <span>{roundedTva}€</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t">
            <span>Total</span>
            <span>{roundedTotal}€</span>
          </div>
        </div>

        <Button
          className="w-full mt-6"
          onClick={handleSubmit}
          disabled={loading || !formValid}
        >
          {loading ? "Chargement..." : "Procéder au paiement"}
        </Button>
        <a
          href="/panier"
          className="block text-center text-green-600 hover:text-green-700 mt-4 text-sm"
        >
          Retour vers le panier →
        </a>
      </div>
    </div>
  );
}

export default Recapitulatif;
