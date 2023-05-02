import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { chain } from "lodash-es";
import type { FC } from "react";

interface PaginationProps {
  currentIndex: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentIndex,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pagesToDisplay = chain(pages)
    .drop(currentIndex - 2)
    .take(5)
    .value();

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => {
            if (currentIndex > 0) onPageChange(currentIndex - 1);
          }}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {/* Current: "border-stone-500 text-stone-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
        {pagesToDisplay.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page - 1)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${
              page === currentIndex + 1
                ? "border-stone-500 text-stone-600"
                : "border-transparent"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => {
            if (currentIndex < totalPages - 1) onPageChange(currentIndex + 1);
          }}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Next
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </div>
    </nav>
  );
};
