import { Product } from "@/utils/interfaces/products.interface";
import { fetchProductsQuery, fetchProducts } from "./filter.function";

export const fetchData = async (
  categoriesSelected: number[],
  priceFilter: { min: number; max: number }[],
  currentPage: number,
  setProducts: (products: Product[]) => void,
  setTotalProducts: (total: number) => void,
  setHasMoreProducts: (hasMore: boolean) => void
) => {
  try {
    let response;

    if (categoriesSelected.length > 0 || priceFilter.length > 0) {
      const params: any = {
        page: currentPage.toString(),
      };
      if (categoriesSelected.length > 0)
        params.category = categoriesSelected.map(String);
      if (priceFilter.length > 0)
        params.price = priceFilter.map(({ min, max }: {min: number, max: number}) =>
          [min, max].join("-")
        );

      response = await fetchProductsQuery(
        params.page,
        params.category,
        params.price
      );
    } else {
      response = await fetchProducts(currentPage.toString());
    }

    const { data, meta } = response;
    setProducts(data);
    setTotalProducts(meta.totalItems);
    setHasMoreProducts(meta.hasMore);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
  }
};