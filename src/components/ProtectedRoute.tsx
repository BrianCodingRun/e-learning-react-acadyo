// src/components/ProtectedRoute.tsx
import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
