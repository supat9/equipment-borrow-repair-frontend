import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

function getPageNumbers(current, total) {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);

    // ลบเลขซ้ำ (เฉพาะเลข ไม่รวม '...')
    const result = [];
    range.forEach((item) => {
        if (item === '...' || !result.includes(item)) {
            result.push(item);
        }
    });
    return result;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-1 text-gray-500 border border-gray-300 cursor-pointer hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
            {pageNumbers.map((page, idx) =>
                page === '...' ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="relative inline-flex items-center px-4 py-1 text-sm font-semibold text-gray-400 border border-gray-300 cursor-pointer focus:outline-offset-0"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={
                            currentPage === page
                                ? "relative z-10 inline-flex items-center bg-[#1bc688] px-4 py-1 text-md text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                : "relative inline-flex items-center px-4 py-1 text-md text-gray-500 border border-gray-300 cursor-pointer hover:bg-white/5 focus:z-20 focus:outline-offset-0"
                        }
                    >
                        {page}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-1 text-gray-500 border border-gray-300 cursor-pointer hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
                <span className="sr-only">Next</span>
                <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
        </nav>
    );
}