import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        auto
        flat
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </Button>
    </div>
  );
};

export default ThemeSwitch;
