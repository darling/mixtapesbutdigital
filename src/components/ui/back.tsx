import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import type { FC } from "react";

interface BackButtonProps {
  href: string;
  children: React.ReactNode;
}

export const BackButton: FC<BackButtonProps> = ({ href, children }) => {
  return (
    <Link
      className="flex items-center text-gray-500
              "
      href={href}
    >
      <ChevronLeftIcon className="mr-2 h-5 w-5" /> {children}
    </Link>
  );
};
