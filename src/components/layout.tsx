import { Header } from "./header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-700">
      <Header />
      {children}
    </main>
  );
};
