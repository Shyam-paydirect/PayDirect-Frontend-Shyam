import React, { useState } from 'react';
import styles from './InviteUserModal.module.css';

interface InviteUserModalProps {
  onClose: () => void;
  onSubmit: (email: string, role: string) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, role);
  };

  // Close modal when overlay is clicked
  const handleOverlayClick = () => {
    onClose();
  };

  // Prevent overlay click when clicking inside the modal content
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
          &times;
        </button>
        <h2 className={styles.modalTitle}>Invite User</h2>
        <form onSubmit={handleSubmit}>
          <div>
            {/* <label htmlFor="email" className={styles.label}>
              Email
            </label> */}
            <input
              placeholder='Email'
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div>
            {/* <label htmlFor="role" className={styles.label}>
              Role
            </label> */}
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={`${styles.button} ${styles.inviteButton}`}>
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
