import { useRouter } from "next/router";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { navItems } from "~/constants/nav-items";
import Link from "next/link";
import {links} from "~/constants/links";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="flex h-fit min-h-[20vh] justify-center border-t-2">
      <div className="flex min-h-full w-full max-w-[90rem] flex-col items-center justify-center border-t-2">
        {/* <!-- logo --> */}
        <h1 className="mt-10 h-fit w-fit text-3xl font-bold">Goofy Goofers</h1>

        {/* <!-- social handles --> */}
        <div className="mt-8 flex gap-8 opacity-50">
          <FaGithub
            className="size-10"
            onClick={() => {
              window.open(links.GITHUB, "_blank");
            }}
          />
          <FaInstagram
            className="size-10"
            onClick={() => {
              window.open(links.INSTAGRAM, "_blank");
            }}
          />
          <FaGoogle
            className="size-10"
            onClick={() => {
              window.open(links.GOOGLE, "_blank");
            }}
          />
        </div>

        <div className="flex-grow">
          {/* <!-- nav items --> */}
          <ul className="mx-10 mt-8 flex flex-grow flex-wrap items-center justify-center gap-x-10 text-center text-lg font-semibold opacity-80">
            {navItems.map((item) => {
              return (
                <li
                  className={`${router.pathname === item.link ? "underline" : ""}`}
                >
                  <Link href={item.link}>{item.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* <!-- copyright --> */}
        <div className="my-8 text-center text-sm opacity-70">
          <p>&copy; 2021 Goofy Goofers</p>
        </div>
      </div>
    </footer>
  );
}
