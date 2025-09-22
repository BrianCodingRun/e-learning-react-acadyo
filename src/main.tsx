import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import IsLoggedRoute from "./components/IsLoggedRoute.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./index.css";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import ClassroomPage from "./pages/dashboard/ClassroomPage.tsx";
import CourseDetailsPage from "./pages/dashboard/CourseDetailsPage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import DutyDetailsPage from "./pages/dashboard/DutyDetailsPage.tsx";
import NewClassroomPage from "./pages/dashboard/NewClassroomPage.tsx";
import NewCoursePage from "./pages/dashboard/NewCoursePage.tsx";
import NewDutyPage from "./pages/dashboard/NewDutyPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* Routes publiques : accessibles seulement si pas connecté */}
        <Route element={<IsLoggedRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot_password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Routes protégées : accessibles seulement si connecté */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="classroom/:classroomId" element={<ClassroomPage />} />
          <Route
            path="classroom/:classroomId/courses/:courseId"
            element={<CourseDetailsPage />}
          />
          <Route
            path="classroom/:classroomId/duty/:dutyId"
            element={<DutyDetailsPage />}
          />
          <Route path="classroom/add" element={<NewClassroomPage />} />
          <Route
            path="classroom/:classroomId/add"
            element={<NewCoursePage />}
          />
          <Route
            path="classroom/:classroomId/duty/add"
            element={<NewDutyPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </ThemeProvider>
);
