import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50">
      <Header />
      <main className="container mx-auto px-4 pt-2 pb-8 md:py-8">
        {" "}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
