import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { AppDispatch } from "@/app/redux/store";
import { fetchUserNotifications } from "@/app/redux/slices/api/notificationSlice";
import styles from "./NotificationsModal.module.css";

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

// Helper function to compute time ago
const getTimeAgo = (dateString: string): string => {
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diff = now - past;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({ open, onClose, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error } = useSelector((state: RootState) => state.userNotification);
  const [showAll, setShowAll] = useState(false);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (open) {
      dispatch(fetchUserNotifications(userId));
      setShowAll(false); // Reset to show only three when reopened
    }
  }, [open, userId, dispatch]);

  if (!open) return null;

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {loading && <p>Loading...</p>}
        {displayedNotifications.map((notification, index) => (
          <div key={index} className={styles.notificationCard}>
            <div className={styles.notificationHeader}>
              <span className={styles.orderId}>Order #{notification.orderId}</span>
              <span className={styles.time}>
                {getTimeAgo(notification.createdAt)}
              </span>
            </div>
            <div className={styles.notificationBody}>
              <p>
                {notification.transactionUpdates.length > 0
                  ? notification.transactionUpdates[0].description
                  : "No description"}
              </p>
            </div>
          </div>
        ))}
        {!showAll && notifications.length > 3 && (
          <button className={styles.showMoreButton} onClick={() => setShowAll(true)}>
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;
