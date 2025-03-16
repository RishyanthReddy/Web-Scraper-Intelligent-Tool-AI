import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";

type ScrapeStatus = "idle" | "loading" | "success" | "error" | "pending";

interface ScrapeStatusBadgeProps {
  status: ScrapeStatus;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const ScrapeStatusBadge = ({
  status,
  className = "",
  showText = true,
  size = "md",
}: ScrapeStatusBadgeProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 text-xs",
    md: "h-5 w-5 text-sm",
    lg: "h-6 w-6 text-base",
  };

  const iconSize = sizeClasses[size];

  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: <Loader2 className={`${iconSize} mr-1.5 animate-spin`} />,
          text: "Scraping...",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      case "success":
        return {
          icon: <CheckCircle className={`${iconSize} mr-1.5`} />,
          text: "Success",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "error":
        return {
          icon: <AlertCircle className={`${iconSize} mr-1.5`} />,
          text: "Error",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      case "pending":
        return {
          icon: <Clock className={`${iconSize} mr-1.5`} />,
          text: "Pending",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      default:
        return {
          icon: null,
          text: "Idle",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const { icon, text, bgColor, textColor, borderColor } = getStatusConfig();

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full border",
        bgColor,
        textColor,
        borderColor,
        className,
      )}
    >
      {icon}
      {showText && (
        <span className={`font-medium ${size === "sm" ? "text-xs" : ""}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default ScrapeStatusBadge;
