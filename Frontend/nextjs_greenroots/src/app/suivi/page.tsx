'use client'

import { User } from "@/utils/interfaces/users.interface";
import { PurchaseDetails } from "@/utils/interfaces/purchase.interface";
import { useState, useEffect, use } from "react";

export default function SuiviPage() {
    const [ purchases, setPurchases ] = useState<PurchaseDetails[]>([]);
    const [ user, setUser ] = useState<User | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);
    
    useEffect(() => {
        const fetchPurchases = async () => {
            const response = await fetch(`http://localhost:3000/purchases/${user?.id}`, {
                credentials: 'include',
            });
            const data = await response.json();
            setPurchases(data);
        }
        fetchPurchases();
    }, [user]);

    console.log(purchases);

  return <div>
    
  </div>;
}