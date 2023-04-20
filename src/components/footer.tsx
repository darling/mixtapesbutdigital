import Link from "next/link";
import { Container } from "./ui/container";

const navigation = {
  main: [
    { name: "TOS", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Meow", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="">
      <Container>
        <div className="px-6 py-20 sm:py-24 lg:px-8">
          <nav
            className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
            aria-label="Footer"
          >
            {navigation.main.map((item) => (
              <div key={item.name} className="pb-6">
                <Link
                  href={item.href}
                  className="text-sm font-bold leading-6 text-stone-500 hover:text-stone-900"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>
          <p className="mt-10 text-center text-xs leading-5 text-stone-500">
            &copy; 2023 Carter (Safe). All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
