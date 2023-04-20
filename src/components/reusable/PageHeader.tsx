import type { FC } from "react";

interface PageHeaderProps {
  title: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-serif text-7xl font-bold">{title}</h1>
    </div>
  );
};
