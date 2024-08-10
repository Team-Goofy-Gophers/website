import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { navItems } from "~/constants/nav-items";
import ThemeSwitch from "./theme-switch";
import Profile from "./profile";
import Drawer from "./drawer";
import { GiHamburgerMenu } from "react-icons/gi";

export default function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

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
      <nav className="relative flex h-20 w-full flex-row items-center justify-center border-b-2 text-foreground">
        {/* <!-- logo --> */}
        <div className="flex w-full max-w-[90rem] flex-row px-6">
          <Link
            href="/"
            className="w-full text-center text-4xl font-extrabold hover:cursor-pointer lg:w-fit"
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
          </ul>

          {/* <!-- profiles --> */}
          <div className="hidden w-fit items-center gap-4 lg:flex">
            <ThemeSwitch />
            <Profile />
          </div>

          {/* <!-- mobile options --> */}
          <GiHamburgerMenu
            className="relative block size-10 lg:hidden"
            onClick={toggleDrawer}
          />
        </div>
      </nav>
      <Drawer isOpen={menuOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}
