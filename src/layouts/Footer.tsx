import { Home, BarChart2, Target, Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Statistics", href: "/statistics", icon: BarChart2 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Planning", href: "/day-planning", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];


const Footer = () => {
  return (
    <>
    <footer className="md:hidden fixed bottom-0 left-0 w-full bg-[#272B3B] dark:bg-[#101422] text-white z-50">
      <nav className="flex justify-around py-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex flex-col items-center text-sm text-white hover:text-[#A8DCE7] transition-colors"
          >
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </footer>
    <div className="md:hidden pb-16"></div>
    </>
  );
};

export default Footer;
