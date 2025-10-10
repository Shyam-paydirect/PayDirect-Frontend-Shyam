import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  return (
    <div className="pagination-container">
      <p className="pagination-info">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
      </p>
      <div className="pagination-buttons">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        >
          Prev
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
