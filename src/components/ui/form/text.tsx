import { useFormContext } from "react-hook-form";

import type { FC } from "react";

interface FormTextInputProps {
  name: string;
  label: string;
}

export const FormTextInput: FC<FormTextInputProps> = ({ name, label }) => {
  const { register } = useFormContext();

  return (
    <div className="col-span-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-stone-600"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          type="text"
          autoComplete="off"
          className="block w-full rounded-md border-gray-300 shadow-sm invalid:border-red-500 invalid:text-red-500 invalid:placeholder-red-500 invalid:ring-2 invalid:ring-red-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...register(name)}
        />
      </div>
    </div>
  );
};

interface FormLongTextInputProps {
  name: string;
  label: string;
  description?: string;
}

export const LongFormTextInput: FC<FormLongTextInputProps> = ({
  name,
  label,
  description,
}) => {
  const { register } = useFormContext();

  return (
    <div className="col-span-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-stone-600"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={name}
          rows={3}
          autoComplete="off"
          className="block w-full rounded-md border-0 py-1.5 text-stone-600 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 invalid:border-red-500 invalid:text-red-500 invalid:placeholder-red-500 invalid:ring-2 invalid:ring-red-500 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
          {...register(name)}
        />
      </div>
      <p
        hidden={description === undefined}
        className="mt-3 text-sm leading-6 text-gray-600"
      >
        {description}
      </p>
    </div>
  );
};
