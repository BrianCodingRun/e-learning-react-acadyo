import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./index.css";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import ClassroomPage from "./pages/dashboard/ClassroomPage.tsx";
import CourseDetailsPage from "./pages/dashboard/CourseDetailsPage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import NewClassroomPage from "./pages/dashboard/NewClassroomPage.tsx";
import NewCoursePage from "./pages/dashboard/NewCoursePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<App />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="classroom/:classroomId" element={<ClassroomPage />} />
            <Route
              path="classroom/courses/:id"
              element={<CourseDetailsPage />}
            />
            <Route path="classroom/add" element={<NewClassroomPage />} />
            <Route path="classroom/course/add" element={<NewCoursePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </ThemeProvider>
);
