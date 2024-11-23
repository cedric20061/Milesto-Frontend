import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import HomePage from "@/pages/home";
import Settings from "@/pages/settings.tsx";
import Statistics from "@/pages/statistics.tsx";
import GoalsPage from "@/pages/goalPage.tsx";
import PlanningDay from "@/pages/planningDay.tsx";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/day-planning" element={<PlanningDay />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
