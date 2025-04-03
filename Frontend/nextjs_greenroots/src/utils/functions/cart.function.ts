import { CartItem } from "@/context/CartContext";



export async function processCartItems(cartItems: CartItem[], total: number) {
  const purchaseData = {
    user_id: 1,
    address: "123 route dannecy",
    postalcode: "74000",    
    city: "annecy",
    total,
    status: "en cours",
  }
  const process = await fetch(`http://localhost:3000/purchases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(purchaseData),
  });
  const purchaseCreated = await process.json();
  const purchaseId = purchaseCreated.id;
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><",process);


  const processProducts = await fetch(`http://localhost:3000/purchase-products/${purchaseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: cartItems.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        total: product.price * product.quantity,
      })),
    }),
  });
  const purchaseProductsCreated = await processProducts.json();
  return purchaseProductsCreated;


}
