import { Header } from "./header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};
