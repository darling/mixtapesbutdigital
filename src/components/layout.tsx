import { Footer } from "./footer";
import { Header } from "./header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" bg-stone-100 text-stone-700">
      <div className="min-h-screen">
        <Header />
        {children}
      </div>
      <Footer />
    </main>
  );
};
