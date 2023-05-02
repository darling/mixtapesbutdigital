export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-10">
      {children}
    </div>
  );
};
