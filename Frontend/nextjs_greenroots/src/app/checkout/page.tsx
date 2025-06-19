"use client";
// Dépendances
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Composants
import HeaderWithScroll from "@/components/header/HeaderWithScroll";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Formulaire from "@/components/checkout/Formulaire";

// utils
import { useCart } from "@/context/CartContext";
import { User } from "@/utils/interfaces/users.interface";
import { handleCheckoutSubmit } from "@/utils/functions/function";
import { validateForm } from "@/utils/functions/validation.function";
import Recapitulatif from "@/components/checkout/Recapitulatif";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  }>({});
  const [formValid, setFormValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isValid = validateForm(
      firstName,
      lastName,
      address,
      city,
      zipCode,
      setErrors
    );
    setFormValid(isValid);
  }, [firstName, lastName, address, city, zipCode]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { id, value } = e.target;

    const maxLengths: { [key: string]: number } = {
      firstName: 50,
      lastName: 50,
      address: 120,
      city: 50,
      zipCode: 5,
    };

    let sanitizedValue = value;

    if (id === "zipCode") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    if (sanitizedValue.length <= maxLengths[id]) {
      setter(sanitizedValue);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, product) => sum + (product.price || 0) * product.quantity,
    0
  );
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const tva = subtotal * 0.2; // 20% TVA
  const roundedTva = Math.round(tva * 100) / 100;
  const total = subtotal + tva;
  const roundedTotal = Math.round(total * 100) / 100;

  const triggerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleCheckoutSubmit(
      e,
      firstName,
      lastName,
      address,
      city,
      zipCode,
      setErrors,
      setLoading,
      user,
      cartItems,
      router,
      roundedTotal
    );
  };

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={<div className="h-16"></div>}>
        <HeaderWithScroll />
      </Suspense>

      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Panier", href: "/panier" },
              { label: "Enregistrement" },
            ]}
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            ENREGISTREMENT
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Formulaire
              firstName={firstName}
              lastName={lastName}
              address={address}
              city={city}
              zipCode={zipCode}
              errors={errors}
              handleInputChange={handleInputChange}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setAddress={setAddress}
              setCity={setCity}
              setZipCode={setZipCode}
            />

            <Recapitulatif
              cartItems={cartItems}
              roundedSubtotal={roundedSubtotal}
              roundedTva={roundedTva}
              roundedTotal={roundedTotal}
              loading={loading}
              formValid={formValid}
              handleSubmit={triggerSubmit}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
