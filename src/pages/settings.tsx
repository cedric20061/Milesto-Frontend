"use client";

import { useEffect, useState } from "react";
import { RootState } from "@/app/store";
import {
  updateUserProfile,
  logoutUser,
  deleteUserAccount,
  fetchUserInfo,
} from "@/features/auth/authSlice";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Modal from "@/components/app/Modal";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/indexedDBUserPreferences";
import ThemeSwitcher from "@/components/app/ThemeSwitcher";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canUpdateEmail, setCanUpdateEmail] = useState(false);
  const [canUpdatePassword, setCanUpdatePassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const [updatedUser, setUpdatedUser] = useState<{
    name: string;
    email: string;
    newPassword?: string;
    confirmPassword?: string;
    currentPassword?: string;
  }>({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = async () => {
    setError(null);

    if (canUpdateEmail && !currentPassword) {
      setError("Please enter your current password to change email");
      return;
    }

    if (canUpdatePassword) {
      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match");
        return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
    }

    const updatedData = { ...updatedUser };

    if (canUpdatePassword) {
      updatedData.newPassword = newPassword;
      updatedData.confirmPassword = confirmPassword;
    }

    if (canUpdateEmail) {
      updatedData.email = updatedUser.email;
    }

    if (currentPassword) {
      updatedData.currentPassword = currentPassword;
    }

    try {
      await dispatch(updateUserProfile(updatedData)).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      setError(
        JSON.parse(err as string).message || "An unknown error occurred"
      );
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === user?.email) {
      dispatch(deleteUserAccount());
    } else {
      setError("Please enter your email correctly to delete your account");
    }
  };

  const [notifications, setNotifications] = useState({
    dailyReminder: false,
    goalUpdates: false,
  });

  useEffect(() => {
    const savedNotifications =
      getFromLocalStorage<typeof notifications>("user_notifications");
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage("user_notifications", notifications);
  }, [notifications]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#101422] dark:text-[#A8DCE7]">
          Settings
        </h1>

        <Card className="bg-indigo-50 dark:bg-[#272B3B] border-[#A8DCE7] dark:border-[#101422]">
          <CardHeader>
            <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="daily-reminder"
                className="text-[#101422] dark:text-indigo-50"
              >
                Daily Reminder
              </Label>
              <Switch
                id="daily-reminder"
                checked={notifications.dailyReminder}
                onCheckedChange={() => toggleNotification("dailyReminder")}
                className={`relative inline-flex h-6 w-12 items-center rounded-full 
                  transition-colors duration-300 ease-in-out dark:bg-[#101422] 
                  shadow-lg data-[state=checked]:bg-[#A8DCE7] dark:data-[state=checked]:bg-[#A8DCE7] border-2-[#A8DCE7]`}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="goal-updates"
                className="text-[#101422] dark:text-indigo-50"
              >
                Goal Updates
              </Label>
              <Switch
                id="goal-updates"
                checked={notifications.goalUpdates}
                onCheckedChange={() => toggleNotification("goalUpdates")}
                className={`relative inline-flex h-6 w-12 items-center rounded-full 
                    transition-colors duration-300 ease-in-out dark:bg-[#101422] 
                    shadow-lg data-[state=checked]:bg-[#A8DCE7] dark:data-[state=checked]:bg-[#A8DCE7] border-2-[#A8DCE7]`}
              ></Switch>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 dark:bg-[#272B3B] border-[#A8DCE7] dark:border-[#101422]">
          <CardHeader>
            <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
              Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher type="dropdown" />
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 dark:bg-[#272B3B] border-[#A8DCE7] dark:border-[#101422]">
          <CardHeader>
            <CardTitle className="text-[#272B3B] dark:text-[#A8DCE7]">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              Update profile
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[#A8DCE7] text-[#101422] hover:bg-[#272B3B] hover:text-indigo-50 rounded-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              variant="destructive"
              className="w-full bg-red-500 text-indigo-50 hover:bg-red-600 rounded-full"
              onClick={() => setIsModalDeleteOpen(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
      >
        <div className="p-6 space-y-6 bg-indigo-50 dark:bg-[#272B3B] rounded-lg">
          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="block sm:inline">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div>
              <Label className="text-[#101422] dark:text-indigo-50">Name</Label>
              <Input
                type="text"
                value={updatedUser.name}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, name: e.target.value })
                }
                className="w-full mt-2 border rounded p-2 bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50"
              />
            </div>

            <div className="flex items-center gap-4">
              <Checkbox
                checked={canUpdateEmail}
                onCheckedChange={(e) =>
                  setCanUpdateEmail(e.valueOf() as boolean)
                }
              />
              <Label className="text-[#101422] dark:text-indigo-50">
                Update Email
              </Label>
            </div>

            <div className="flex items-center gap-4">
              <Checkbox
                checked={canUpdatePassword}
                onCheckedChange={(e) =>
                  setCanUpdatePassword(e.valueOf() as boolean)
                }
              />
              <Label className="text-[#101422] dark:text-indigo-50">
                Update Password
              </Label>
            </div>

            {(canUpdateEmail || canUpdatePassword) && (
              <div>
                <Label className="text-[#101422] dark:text-indigo-50">
                  Current Password
                </Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full mt-2 border rounded p-2 bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50"
                />
              </div>
            )}

            {canUpdateEmail && (
              <div>
                <Label className="text-[#101422] dark:text-indigo-50">
                  Email
                </Label>
                <Input
                  type="email"
                  value={updatedUser.email}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, email: e.target.value })
                  }
                  className="w-full mt-2 border rounded p-2 bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50"
                  disabled={!canUpdateEmail}
                />
              </div>
            )}

            {canUpdatePassword && (
              <>
                <div>
                  <Label className="text-[#101422] dark:text-indigo-50">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-2 border rounded p-2 bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50"
                  />
                </div>
                <div>
                  <Label className="text-[#101422] dark:text-indigo-50">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-2 border rounded p-2 bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalDeleteOpen}
        onClose={() => {
          setIsModalDeleteOpen(false);
          setError(null);
        }}
      >
        <div className="p-6 space-y-6 bg-indigo-50 dark:bg-[#272B3B] rounded-lg">
          <h2 className="text-2xl font-bold text-[#272B3B] dark:text-[#A8DCE7]">
            Delete Account
          </h2>
          <p className="text-[#101422] dark:text-indigo-50">
            This action cannot be undone. Please enter your email address to
            confirm.
          </p>
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            </motion.div>
          )}
          <Input
            type="email"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Enter your email"
            className="w-full mt-2 border rounded p-2 bg-indigo-50 dark:bg-[#101422] text-[#101422] dark:text-indigo-50"
          />
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalDeleteOpen(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
