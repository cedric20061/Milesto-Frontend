import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeSwitcherProps {
  type?: "button" | "dropdown"; // Définit le type de contrôleur à afficher
}

export default function ThemeSwitcher({ type = "button" }: ThemeSwitcherProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
    setIsDark(darkMode);
  };

  if (type === "dropdown") {
    return (
      
      <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => toggleDarkMode(false)}
        className={`${isDark === false ? 'bg-[#A8DCE7] rounded-full' : 'rounded-full'}`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Light mode</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => toggleDarkMode(true)}
        className={`${isDark === true ? 'bg-[#A8DCE7] rounded-full' : 'rounded-full'}`}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
    );
  }

  // Par défaut, retourne le bouton
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleDarkMode(!isDark)}
      className="text-[#A8DCE7]"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Basculer le thème</span>
    </Button>
  );
}
