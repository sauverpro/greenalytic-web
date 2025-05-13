import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/types";
import UserForm from "./userform";

export default function EditUserDrawer({
  open,
  onOpenChange,
  user,
  refetchUsers,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  refetchUsers: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Handle escape key press to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Handle animation on open/close
  useEffect(() => {
    if (!drawerRef.current || !backdropRef.current) return;

    if (open) {
      document.body.style.overflow = "hidden"; 
      backdropRef.current.classList.remove("opacity-0");
      backdropRef.current.classList.add("opacity-50");
      drawerRef.current.classList.remove("translate-x-full");
      drawerRef.current.classList.add("translate-x-0");
    } else {
      document.body.style.overflow = "";
      if (backdropRef.current) {
        backdropRef.current.classList.remove("opacity-50");
        backdropRef.current.classList.add("opacity-0");
      }
      if (drawerRef.current) {
        drawerRef.current.classList.remove("translate-x-0");
        drawerRef.current.classList.add("translate-x-full");
      }
    }
  }, [open]);

  const handleSuccess = () => {
    refetchUsers();
    onOpenChange(false);
  };

  if (!user) return null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black opacity-0 transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-950 shadow-lg flex flex-col translate-x-full transition-transform duration-300"
      >
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Userrr</h2>
          <button
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <UserForm user={user} onSubmit={handleSuccess} />
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
