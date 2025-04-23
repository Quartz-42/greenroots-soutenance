export async function fetchCategories() {
    const url = `http://localhost:3000/categories`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }   
    const data = await response.json();
    return data;
}


export async function fetchProductsQuery(
    page: string,
    category?: string | string[]
  ) {
    const params = new URLSearchParams();
    params.append("page", page);
  
    if (Array.isArray(category)) {
      category.forEach((cat) => params.append("category", cat));
    } else if (typeof category === "string") {
      params.append("category", category);
    }
  
    const url = `http://localhost:3000/products/query?${params.toString()}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }
  


export async function fetchProducts() {
     const url = `http://localhost:3000/products`;
        const response = await fetch(url);  
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }   
        const data = await response.json();
        return data;
    }
