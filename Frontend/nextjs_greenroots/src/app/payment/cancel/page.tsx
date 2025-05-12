"use client";

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <XCircle className="w-16 h-16 text-orange-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Paiement annulé</h1>
      <p className="text-gray-600 mb-6">Votre paiement n'a pas été complété ou a été annulé.</p>
      <div className="flex space-x-4">
         {/* Remplacez '/panier' par votre route de panier */}
        <Link href="/panier" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
          Retourner au panier
        </Link>
         {/* Remplacez '/' par votre route d'accueil */}
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
} 