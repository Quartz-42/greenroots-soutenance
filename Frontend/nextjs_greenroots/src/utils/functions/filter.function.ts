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
  category?: string | string[],
  price?: string[]
) {
  const params = new URLSearchParams();
  params.append("page", page);

  if (Array.isArray(category)) {
    category.forEach((cat) => params.append("category", cat));
  } else if (typeof category === "string") {
    params.append("category", category);
  }

  if (Array.isArray(price)) {
    price.forEach((interval) => params.append("price", interval));
  }

  const url = `http://localhost:3000/products/query?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchAllProducts() {
  const url = `http://localhost:3000/products/all`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchProducts(page: string = "1") {
  const params = new URLSearchParams();
  params.append("page", page);

  const url = `http://localhost:3000/products?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
