import { useAuthStore } from "@/store/auth";
import { Navigate, Outlet } from "react-router";

export default function IsLoggedRoute() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    // utilisateur déjà connecté → redirige vers dashboard
    return <Navigate to="/dashboard" />;
  }

  // sinon, afficher la route enfant (login, register, etc.)
  return <Outlet />;
}
