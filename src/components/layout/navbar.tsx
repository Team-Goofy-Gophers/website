import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import { adminNavItems, navItems } from "~/constants/nav-items";
import { api } from "~/utils/api";

import { Badge } from "../ui/badge";
import Drawer from "./drawer";
import Profile from "./profile";

export default function NavBar() {
  const { data: session } = useSession();

  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { data } = api.user.getMe.useQuery();

  function toggleDrawer() {
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    const mainSection = document.getElementById("main-section");

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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed z-50 flex h-16 w-full flex-row items-center justify-center border-b bg-background py-2 text-foreground shadow-xl"
      >
        <div className="flex w-full flex-row items-center justify-between px-6">
          <Link
            href="/"
            className="notranslate text-xl font-bold hover:cursor-pointer"
          >
            Astero
          </Link>

          <ul className="hidden items-center justify-center gap-4 text-lg lg:flex">
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
            {session?.user.role === "ADMIN" && (
              <div className="flex gap-4 rounded-md border-2 border-foreground/50 px-4 py-2 text-sm">
                {adminNavItems.map((item, idx) => {
                  return (
                    <li
                      key={idx}
                      className={`${router.pathname === item.link ? "underline" : ""}`}
                    >
                      <Link href={item.link} className="font-medium">
                        admin/{item.name}
                      </Link>
                    </li>
                  );
                })}
              </div>
            )}
          </ul>

          <div className="hidden w-fit items-center gap-4 lg:flex">
            {data && <Badge>{data?.mmr ?? 0}</Badge>}
            <Profile />
          </div>

          <GiHamburgerMenu
            className="right-5 top-4 block size-7 lg:hidden"
            onClick={toggleDrawer}
          />
        </div>
      </motion.nav>
      <Drawer isOpen={menuOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}
