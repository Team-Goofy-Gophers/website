import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import { adminNavItems, navItems } from "~/constants/nav-items";

import Drawer from "./drawer";
import Profile from "./profile";
import ThemeSwitch from "./theme-switch";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const session = useSession();

  function toggleDrawer() {
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    const mainSection = document.getElementById("main-section");

    console.log(footer);

    if (mainSection && (footer ?? navbar)) {
      if (menuOpen) {
        mainSection?.classList.remove("blur-sm");
        footer?.classList.remove("blur-sm");
        navbar?.classList.remove("blur-sm");
        document.body.style.overflow = "auto";
        setMenuOpen(false);
      } else {
        mainSection?.classList.add("blur-sm");
        footer?.classList.add("blur-sm");
        navbar?.classList.add("blur-sm");
        document.body.style.overflow = "hidden";
        setMenuOpen(true);
      }
    }
  }

  return (
    <>
      <nav className="fixed z-50 flex h-20 w-full flex-row items-center justify-center border-b-2 bg-background text-foreground">
        {/* <!-- logo --> */}
        <div className="flex w-full max-w-[90rem] flex-row px-6">
          <Link
            href="/"
            className="w-full text-nowrap text-center text-3xl font-extrabold hover:cursor-pointer lg:w-fit lg:text-4xl"
          >
            Goofy Gophers
          </Link>

          {/* <!-- nav items --> */}
          <ul className="mx-10 hidden flex-grow flex-row items-center justify-center gap-10 text-center text-xl font-bold lg:flex">
            {navItems.map((item, idx) => {
              return (
                <li
                  key={idx}
                  className={`${router.pathname === item.link ? "underline" : ""}`}
                >
                  <Link href={item.link}>{item.name}</Link>
                </li>
              );
            })}

            {/* <!-- admin links --> */}
            {session?.data?.user?.role === "ADMIN" &&
              adminNavItems.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className={`${
                      router.pathname === item.link ? "underline" : ""
                    }`}
                  >
                    <Link href={item.link}>{item.name}</Link>
                  </li>
                );
              })}
          </ul>

          {/* <!-- profiles --> */}
          <div className="hidden w-fit items-center gap-4 lg:flex">
            {/* <ThemeSwitch />s */}
            <Profile />
          </div>

          {/* <!-- mobile options --> */}
          <GiHamburgerMenu
            className="absolute right-5 top-4 block size-10 lg:hidden"
            onClick={toggleDrawer}
          />
        </div>
      </nav>
      <Drawer isOpen={menuOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}
