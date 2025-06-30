import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Product } from "@/utils/interfaces/products.interface";

interface ListePaginationProps {
  products: Product[];
  currentPage: number;
  hasMoreProducts: boolean;
  totalProducts: number;
  handlePageChange: (page: number) => void;
}

function ListePagination({
  products,
  currentPage,
  hasMoreProducts,
  totalProducts,
  handlePageChange
}: ListePaginationProps) {
  return (
    <div className="flex flex-row justify-evenly items-center ">
      {/* Pagination */}
      {products && products.length > 0 && (
        <div>
          <Pagination>
            <PaginationContent>
              {/* Précédent */}
              <PaginationItem>
                <button
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                    }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Page précédente"
                >
                  Précédent
                </button>
              </PaginationItem>

              {/* Pages précédentes */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(currentPage - 2)}
                  >
                    {currentPage - 2}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Page actuelle */}
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {/* Pages suivantes */}
              {hasMoreProducts && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              {hasMoreProducts &&
                currentPage + 1 < totalProducts / 9 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(currentPage + 2)}
                    >
                      {currentPage + 2}
                    </PaginationLink>
                  </PaginationItem>
                )}

              {/* Suivant */}
              <PaginationItem>
                <button
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${!hasMoreProducts
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                    }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasMoreProducts}
                  aria-label="Page suivante"
                >
                  Suivant
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default ListePagination;