import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import {
  Bars3Icon,
  HomeIcon,
  MusicalNoteIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Footer } from "~/components/footer";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Link from "next/link";
import { SpotifyPlayer } from "./ui/mixtape/spotify";

const navigation = [
  { name: "Overview", href: "/home", icon: HomeIcon },
  {
    name: "Playlists",
    href: "/playlists",
    icon: MusicalNoteIcon,
  },
  {
    name: "Mixtapes",
    href: "/mixtapes",
    icon: RectangleStackIcon,
  },
  {
    name: "About",
    href: "/about",
    icon: QuestionMarkCircleIcon,
  },
  {
    name: "Contribute",
    href: "/contribute",
    icon: SparklesIcon,
  },
];

function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();

  const mixtapesResolver = api.mixtapes.pagedMixtapes.useQuery(
    {
      limit: 5,
      offset: 0,
    },
    {
      enabled: isSignedIn,
      cacheTime: 60,
    }
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tapes = mixtapesResolver.isFetched ? mixtapesResolver.data || [] : [];

  return (
    <>
      {/* Mobile overlay goes first */}
      <div>
        <Transition.Root show={sidebarOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-stone-600 bg-opacity-75 backdrop-blur-lg" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* This is the sidebar component */}

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src={"/img/MixtapesButDigitalLogo.svg"}
                        alt="Mixtapes But Digital"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Navigation
                          </div>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      "text-gray-400 group-hover:text-indigo-600",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your Tapes
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {tapes.map((tape) => (
                              <li key={tape.id}>
                                <Link
                                  href={"/mixtapes/" + tape.id}
                                  className={classNames(
                                    "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                                    )}
                                  >
                                    {tape.public ? "🌎" : "🔒"}
                                  </span>
                                  <span className="truncate">{tape.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>

      {/* Sidebar for Desktop */}

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-8 w-auto"
              src="/img/MixtapesButDigitalLogo.svg"
              alt="MixtapesButDigital"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Navigation
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            "group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Your Tapes
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {tapes.map((tape) => (
                    <li key={tape.id}>
                      <Link
                        href={"/mixtapes/" + tape.id}
                        className={classNames(
                          "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <span
                          className={classNames(
                            "border-stone-200 text-stone-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                          )}
                        >
                          {tape.public ? "🌐" : "🔒"}
                        </span>
                        <span className="truncate">{tape.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <Link
                  href="/me"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={user?.profileImageUrl || "/img/placeholder.jpg"}
                    alt="Profile"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{user?.fullName}</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900"></div>
        <Link href="/me">
          <span className="sr-only">Your profile</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src={user?.profileImageUrl || "/img/placeholder.jpg"}
            alt=""
          />
        </Link>
      </div>

      <main className="lg:pl-72">
        <div className="relative">
          <div>{children}</div>
          {/* Create a div that sits in the bottom middle of the screen */}
          <div className="fixed bottom-0 transform lg:left-72">
            <div className="w-screen max-w-md px-2 pb-2">
              <SpotifyPlayer />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};
