import { motion } from "framer-motion";
import { Home, BarChart2, Target, Calendar, Settings } from "lucide-react";
import ThemeSwitcher from "@/components/app/ThemeSwitcher";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Statistics", href: "/statistics", icon: BarChart2 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Planning", href: "/day-planning", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Header() {
  return (
    <header className="bg-[#272B3B] dark:bg-[#101422] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo for all screen sizes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link
              to="/"
              className="hidden md:flex gap-4 items-center text-2xl font-bold text-[#A8DCE7]"
            >
              <img
                src="/logo1.png"
                alt="logo"
                className="w-10 h-10 rounded-full"
              />
              <p>Milesto</p>
            </Link>
          </motion.div>

          {/* Navigation for medium and larger screens */}
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

          {/* ThemeSwitcher for medium and larger screens */}
          <div className="hidden md:flex items-center">
            <ThemeSwitcher />
          </div>

          {/* Small screen layout */}
          <div className="flex md:hidden justify-between items-center w-full">
            {/* Logo on the left */}
            <Link
              to="/"
              className="flex gap-4 items-center text-2xl font-bold text-[#A8DCE7]"
            >
             <img
                src="/logo1.png"
                alt="logo"
                className="w-10 h-10 rounded-full"
              />
              <p>Milesto</p>
            </Link>

            {/* ThemeSwitcher on the right */}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
