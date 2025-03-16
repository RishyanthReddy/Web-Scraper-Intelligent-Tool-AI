import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  iconSize?: number;
}

const InfoTooltip = ({
  content,
  className = "",
  iconSize = 16,
}: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center cursor-help ${className}`}>
            <HelpCircle size={iconSize} className="text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
