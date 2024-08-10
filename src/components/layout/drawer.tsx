import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IoMdClose } from "react-icons/io";

import { navItems } from "~/constants/nav-items";

import Profile from "./profile";
import ThemeSwitch from "./theme-switch";

export default function Drawer(props: {
  isOpen: boolean;
  toggleDrawer: () => void;
}) {
  const router = useRouter();

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-[300px] transform border-l-2 bg-background text-foreground transition-transform duration-500 ease-in-out ${
          props.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* <!-- close button --> */}
        <IoMdClose
          className="absolute right-5 top-5 size-10"
          onClick={() => props.toggleDrawer()}
        />

        {/* <!-- nav options --> */}
        <ul className="mt-24 flex flex-col gap-y-8 text-center">
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
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-4">
          <ThemeSwitch />
          <Profile />
        </div>
      </div>
    </>
  );
}
