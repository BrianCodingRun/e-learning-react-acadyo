import { useAuthStore } from "@/store/auth";
import { Package, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import JoinClassroom from "./JoinClassroom";

export default function EmptyFolder({
  message,
  action,
}: {
  message: string;
  action?: boolean;
}) {
  const { user } = useAuthStore();
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Empty State */}
      <motion.div
        className="relative border border-dashed border-sidebar/50 rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px] bg-sidebar/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative Elements - Minimalistic */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/5 rounded-full" />
          <div className="absolute bottom-10 -left-6 w-10 h-10 bg-primary/5 rounded-full" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            className="relative mb-6 p-4"
            animate={{
              y: isHovering ? -5 : 0,
              rotate: isHovering ? [0, -2, 2, -2, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-primary/10 rounded-xl -rotate-6 scale-90 transform-gpu" />
            <div className="absolute inset-0 bg-primary/5 rounded-xl rotate-3 scale-95 transform-gpu" />
            <div className="relative bg-sidebar/90 shadow-lg rounded-xl p-6 flex items-center justify-center">
              <Package className="h-16 w-16 text-primary" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">C'est vide ici !</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            {message}
          </p>
          {user.roles[0] == "ROLE_ADMIN" && "ROLE_TEACHER"
            ? action && (
                <div
                  className="flex items-center gap-1 h-8 px-2 py-4 mb-8 bg-primary text-primary-foreground rounded-sm text-xs font-semibold hover:bg-primary/90 transition-colors"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Plus className="size-4" />
                  <a href="dashboard/classroom/add">Créer un classroom</a>
                </div>
              )
            : action && (
                <div
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <JoinClassroom />
                </div>
              )}
        </div>
      </motion.div>
    </div>
  );
}
