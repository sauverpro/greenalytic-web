import React from "react";

/* Dummy Notifications Panel */
function NotificationsPanel() {
  return (
    <div className="space-y-4 bg-gray-100 z-50">
      <div className="bg-gray-100 p-3 rounded-lg">
        <p className="text-sm">🔔 System Update Completed</p>
        <span className="text-xs text-sms">2 hours ago</span>
      </div>
    </div>
  );
}

export default NotificationsPanel;
