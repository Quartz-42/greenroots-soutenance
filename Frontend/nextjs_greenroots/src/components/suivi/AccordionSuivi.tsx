"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PurchaseDetails } from "@/utils/interfaces/purchase.interface";
import Image from "next/image";

interface AccordionSuiviProps {
  purchases: PurchaseDetails[];
  isLoadingPurchases: boolean;
}

export default function AccordionSuivi({
  purchases,
  isLoadingPurchases,
}: AccordionSuiviProps) {
  if (isLoadingPurchases) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Chargement des commandes...</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">
          Vous n'avez pas encore passé de commande.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {purchases.map((p) => (
        <AccordionItem
          key={p.id}
          value={`item-${p.id}`}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full text-left">
              <div className="mb-2 md:mb-0">
                <span className="text-lg font-semibold text-gray-800">
                  Commande #{p.id}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {p.date
                    ? new Date(p.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Date inconnue"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold text-gray-900">
                  Total: {p.total ? `${p.total.toFixed(2)}€` : "N/A"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Statut:{" "}
                  <span className="font-medium">{p.status || "Inconnu"}</span>
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 md:px-6 pb-6 pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Articles commandés
            </h3>
            <ul className="space-y-4">
              {p.PurchaseProduct && p.PurchaseProduct.length > 0 ? (
                p.PurchaseProduct.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start space-x-4 text-sm"
                  >
                    <Image
                      src={item.Product?.Image?.[0]?.name || "/product.png"}
                      alt={item.Product?.name || "Produit"}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <span className="font-medium text-gray-800 block">
                        {item.Product?.name || "Produit inconnu"}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="text-gray-800 block text-sm">
                        Quantité : {item.quantity} - PU :{" "}
                        {typeof item.Product?.price === "number"
                          ? item.Product.price.toFixed(2)
                          : item.Product?.price || "N/A"}
                        €
                      </span>
                      <span className="text-gray-800 block font-medium">
                        Total :{" "}
                        {typeof item.Product?.price === "number"
                          ? (item.Product.price * item.quantity).toFixed(2)
                          : "N/A"}
                        €
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">
                  Aucun détail d'article disponible.
                </li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
