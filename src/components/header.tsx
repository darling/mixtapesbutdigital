import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth, useUser } from "@clerk/nextjs";
import { Container } from "./ui/container";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Playlists", href: "/playlists" },
  { name: "Mixtapes", href: "/mixtapes" },
];

const menuNavigation = [{ name: "Your Profile", href: "/me" }];

export const Header = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <Container>
            <div className="flex h-16 justify-between">
              <Link href="/" className="flex flex-shrink-0 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="block h-8 w-auto lg:hidden"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hidden h-8 w-auto lg:block"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      "inline-flex items-center px-1 pt-1 text-sm font-bold text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.profileImageUrl}
                        alt="profile image"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {menuNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full px-4 py-2 text-left text-sm text-gray-700"
                            )}
                            onClick={() => {
                              signOut().catch(console.error);
                            }}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </Container>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    "block px-4 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.profileImageUrl}
                    alt="profile image"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.firstName}
                  </div>
                  <div className="text-sm font-medium text-gray-500"></div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {menuNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      "block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => {
                    signOut().catch(console.error);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
