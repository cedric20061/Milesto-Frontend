import { motion } from "framer-motion";
import { Home, BarChart2, Target, Calendar, Settings } from "lucide-react";
import ThemeSwitcher from "@/components/app/ThemeSwitcher";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Statistiques", href: "/statistics", icon: BarChart2 },
  { name: "Objectifs", href: "/goals", icon: Target },
  { name: "Planification", href: "/day-planning", icon: Calendar },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export default function Header() {
  return (
    <header className="bg-[#272B3B] dark:bg-[#101422] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center pb-1 w-full md:w-auto md:justify-start"
          >
            <Link
              to="/"
              className="flex gap-4 items-center justify-center text-2xl font-bold text-[#A8DCE7]"
            >
              <img
                src="/logo1.png"
                alt="logo"
                className="w-10 h-10 rounded-full"
              />
              <p>Milesto</p>
            </Link>
          </motion.div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className="hover:text-[#A8DCE7] transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="hidden md:flex items-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
