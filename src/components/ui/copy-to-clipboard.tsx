import { AnimatePresence, motion } from "framer-motion";
import { Check, Clipboard } from "lucide-react";
import { useEffect, useState } from "react";

// Custom hook for clipboard functionality with fallback
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      // First, try to focus the document
      if (document.hasFocus && !document.hasFocus()) {
        window.focus();
      }

      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        return true;
      } else {
        // Fallback to execCommand method
        return fallbackCopyTextToClipboard(text);
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback method:", err);
      // If modern API fails, try fallback
      return fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Make it invisible but still selectable
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);

      // Focus and select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      // Execute copy command
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setIsCopied(true);
        return true;
      } else {
        throw new Error("execCommand copy failed");
      }
    } catch (err) {
      console.error("Fallback copy method failed:", err);
      return false;
    }
  };

  const resetCopyState = () => {
    setIsCopied(false);
  };

  return { isCopied, copyToClipboard, resetCopyState };
}

// Update the CopyToClipboardProps interface to include variant and size props
interface CopyToClipboardProps {
  textToCopy: string;
  className?: string;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "minimal";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

// Update the component to use the new props
export default function CopyToClipboard({
  textToCopy,
  className = "",
  variant = "default",
  size = "md",
  showText = true,
}: CopyToClipboardProps) {
  const { isCopied, copyToClipboard, resetCopyState } = useCopyToClipboard();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setShowTooltip(true);
    } else {
      // Show error feedback
      setShowTooltip(true);
      // You could also set a different state for error display
    }
  };

  useEffect(() => {
    if (isCopied) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 1500);

      const resetTimer = setTimeout(() => {
        resetCopyState();
      }, 2500);

      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [isCopied, resetCopyState]);

  // Variant styles
  const variantStyles = {
    default:
      "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700",
    primary: "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500",
    secondary:
      "bg-purple-500 hover:bg-purple-600 text-white border border-purple-500",
    outline:
      "bg-transparent hover:bg-gray-50 border-2 border-gray-300 text-gray-700 hover:border-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border-none",
    minimal:
      "bg-gray-50 hover:bg-gray-100 text-gray-600 border-none rounded-full",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-3",
  };

  // Icon sizes
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="relative inline-block">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-md shadow-lg whitespace-nowrap z-10"
          >
            Copié dans le presse-papier!
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={handleCopy}
        disabled={isCopied}
        className={`
          flex items-center rounded-lg 
          transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {/* Icon with smooth transition */}
        <motion.div
          key={isCopied ? "check" : "clipboard"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {isCopied ? (
            <Check
              className={`${iconSizes[size]} ${
                variant === "primary" || variant === "secondary"
                  ? "text-white"
                  : "text-green-600"
              }`}
            />
          ) : (
            <Clipboard
              className={`${iconSizes[size]} ${
                variant === "primary" || variant === "secondary"
                  ? "text-white"
                  : "text-neutral-900"
              }`}
            />
          )}
        </motion.div>

        {/* Text with smooth transition */}
        {showText && (
          <motion.span
            key={isCopied ? "copied" : "copy"}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`font-medium text-neutral-900 ${
              isCopied &&
              (variant === "default" ||
                variant === "outline" ||
                variant === "ghost")
                ? "text-green-600"
                : ""
            }`}
          >
            {isCopied ? "Copié !" : "Copier"}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
