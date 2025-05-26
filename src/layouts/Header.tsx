import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  BarChart2,
  Target,
  Calendar,
  Settings,
  BellRing,
  BellOff,
} from "lucide-react";
import ThemeSwitcher from "@/components/app/ThemeSwitcher";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { urlBase64ToUint8Array } from "@/utils/notifications";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Statistics", href: "/statistics", icon: BarChart2 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Planning", href: "/day-planning", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Header() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      checkSubscriptionStatus();
    }
  }, []);

  async function checkSubscriptionStatus() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) {
      setSubscription(sub);
      setIsNotificationsEnabled(true);
    }
  }

  const handleNotificationToggle = async () => {
    if (isNotificationsEnabled) {
      await unsubscribeFromPush();
    } else {
      await subscribeToPush();
    }
  };

  async function subscribeToPush() {
    console.log("subscribeToPush called");
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log("registration", registration);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_REACT_VAPID_PUBLIC_KEY!
        ),
      });
      setSubscription(sub);

      await fetch(`${import.meta.env.VITE_REACT_API_URL}/subscribe`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sub),
      });
      setIsNotificationsEnabled(true);
    } catch (err) {
      console.error("❌ Error in subscribeToPush:", err);
    }
  }

  async function unsubscribeFromPush() {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      await fetch(`${import.meta.env.VITE_REACT_API_URL}/subscribe`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setIsNotificationsEnabled(false);
    }
  }
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNotificationToggle}
                      className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isNotificationsEnabled ? "enabled" : "disabled"}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isNotificationsEnabled ? (
                            <BellRing className="h-5 w-5" />
                          ) : (
                            <BellOff className="h-5 w-5" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isNotificationsEnabled
                        ? "Désactiver les notifications"
                        : "Activer les notifications"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ThemeSwitcher />
            </motion.div>
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNotificationToggle}
                      className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isNotificationsEnabled ? "enabled" : "disabled"}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isNotificationsEnabled ? (
                            <BellRing className="h-5 w-5" />
                          ) : (
                            <BellOff className="h-5 w-5" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isNotificationsEnabled
                        ? "Désactiver les notifications"
                        : "Activer les notifications"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ThemeSwitcher />
            </motion.div>
            {/* ThemeSwitcher on the right */}
          </div>
        </div>
      </div>
    </header>
  );
}
