import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";

// const classNames = (...classes: unknown[]) => {
//     return classes.filter(Boolean).join(" ");
// };

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const FormSection: FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-stone-700/10 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-stone-700">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          {children}
        </div>
      </div>
    </>
  );
};
