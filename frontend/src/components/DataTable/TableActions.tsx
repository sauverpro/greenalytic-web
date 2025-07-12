"use client";

import type React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface ActionItem {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TableActionsProps {
  actions: ActionItem[];
}

const TableActions = ({ actions }: TableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          // Check if we need to add a separator before this item
          const needsSeparator =
            index > 0 &&
            (action.variant === "destructive" ||
              (actions[index - 1].variant === "default" &&
                action.variant !== actions[index - 1].variant));

          return (
            <div key={`${action.label}-${index}`}>
              {needsSeparator && <DropdownMenuSeparator />}

              {action.href ? (
                <DropdownMenuItem asChild disabled={action.disabled}>
                  <Link
                    href={action.href}
                    className={
                      action.variant === "destructive" ? "text-red-500" : ""
                    }
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={action.onClick}
                  className={
                    action.variant === "destructive" ? "text-red-500" : ""
                  }
                  disabled={action.disabled}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
