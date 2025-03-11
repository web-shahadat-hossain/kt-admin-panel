interface MyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MyPagination: React.FC<MyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNum) => (
              <li key={pageNum}>
                <button
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 leading-tight ${
                    currentPage === pageNum
                      ? "text-blue-600 bg-blue-50 border border-blue-300"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              </li>
            )
          )}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
