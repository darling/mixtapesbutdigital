import * as Switch from "@radix-ui/react-switch";
import { Controller, useFormContext } from "react-hook-form";

import type { FC } from "react";

interface CheckBoxInputProps {
  name: string;
  label: string;
  description?: string;
}

function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export const CheckBoxInput: FC<CheckBoxInputProps> = ({
  name,
  label,
  description,
}) => {
  const { control } = useFormContext();

  return (
    <div className="col-span-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-stone-600"
        >
          {label}
        </label>
        <div className="mt-1">
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Switch.Root
                id={name}
                className={classNames(
                  "group",
                  "radix-state-checked:bg-stone-600",
                  "radix-state-unchecked:bg-gray-200",
                  "relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                  "focus:outline-none focus-visible:ring focus-visible:ring-stone-500 focus-visible:ring-opacity-75"
                )}
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
              >
                <Switch.Thumb
                  className={classNames(
                    "group-radix-state-checked:translate-x-5",
                    "group-radix-state-unchecked:translate-x-0",
                    "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                  )}
                />
              </Switch.Root>
            )}
          />
        </div>
      </div>
      <p hidden={!description} className="text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
};
