import React from "react";
import { User } from "lucide-react";

function ProfilePanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <User className="w-12 h-12 bg-gray-300 rounded-full p-2" />
        <div>
          <h3 className="text-lg font-semibold">Nil Yeager</h3>
          <p className="text-sm text-gray-500">Manager</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePanel
