import React from 'react'
import { useTheme } from 'next-themes'
import { FaSun } from "react-icons/fa";
import { RiMoonClearFill } from "react-icons/ri";


export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme()
    const tailClasses = "size-8"

    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light")
    }

  return (
    <>
      {theme === "light" ? (
        <FaSun className={tailClasses} onClick={toggleTheme} />
      ) : (
        ""
      )}
      {theme === "dark" ? (
        <RiMoonClearFill className={tailClasses} onClick={toggleTheme} />
      ) : (
        ""
      )}
    </>
  );
}
