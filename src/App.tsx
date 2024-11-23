import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage.tsx";
import HomePage from "@/pages/home";
import Settings from "@/pages/settings.tsx";
import Statistics from "@/pages/statistics.tsx";
import GoalsPage from "@/pages/goalPage.tsx";
import PlanningDay from "@/pages/planningDay.tsx";
import PrivateRoute from "@/routes/PrivateRoute";
import { store } from "@/app/store.ts";
import { Provider } from "react-redux";
import Layout from "@/layouts/Layout";

const AppRouter = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="*" element={<Navigate to="/" />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/day-planning" element={<PlanningDay />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default AppRouter;
