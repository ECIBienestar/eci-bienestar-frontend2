import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate
}) => {
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`text-sm flex items-center gap-1 text-gray-400 hover:text-gray-700 ${
          currentPage === 1 ? "cursor-not-allowed" : ""
        }`}
      >
        ← Anterior
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 text-gray-500">...</span>
        ) : (
          <button
            key={idx}
            onClick={() => paginate(Number(page))}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-[#362550] text-white"
                : "text-black hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`text-sm flex items-center gap-1 text-gray-400 hover:text-gray-700 ${
          currentPage === totalPages ? "cursor-not-allowed" : ""
        }`}
      >
        Siguiente →
      </button>
    </div>
  );
};

export default Pagination;
