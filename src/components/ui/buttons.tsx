import type { FC } from "react";
import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  className?: string;
}

type ButtonType = FC<ButtonProps>;

const classNames = (...classes: unknown[]) => {
  return classes.filter(Boolean).join(" ");
};

const Base: ButtonType = ({ className, children, ...props }) => {
  return (
    <button type={undefined} {...props} className={className}>
      {children}
    </button>
  );
};

const Basic: ButtonType = (props) => {
  return (
    <Base
      {...props}
      className={classNames(
        "rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
        props.className
      )}
    />
  );
};

const Primary: ButtonType = (props) => {
  return (
    <Base
      {...props}
      className={classNames(
        "rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        props.className
      )}
    />
  );
};

export const Button = {
  Basic,
  Primary,
};
