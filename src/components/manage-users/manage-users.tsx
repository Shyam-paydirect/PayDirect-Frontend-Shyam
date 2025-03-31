import React, { useState, useEffect } from "react";
import "./manage-users.css"; // Your CSS file
import { useDispatch } from "react-redux";
import { fetchUsersByMerchantId, inviteUser, removeUser, changePassUser } from "@/app/redux/slices/api/userManagementSlice";
import Cookies from "js-cookie";
import { AppDispatch } from "@/app/redux/store";
import { toast, ToastContainer } from "react-toastify";
import InviteUserModal from "./invite-modal";

type User = {
  id: number;
  username: string;
  role: string;
  delete_flag: number;
};

const ITEMS_PER_PAGE = 5;

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const merchantId = Cookies.get("merchant_id") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await dispatch(fetchUsersByMerchantId(merchantId)).unwrap();
        setUsers(fetchedUsers ?? []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch, merchantId]);

  const totalPages = Math.ceil((users?.length ?? 0) / ITEMS_PER_PAGE);
  const displayedUsers = users?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) ?? [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangePassword = async (user: User) => {
    try {
      const changed = await dispatch(changePassUser({ id: String(user.id), role: "admin" })).unwrap();
      toast.success(changed?.message)
    } catch (error) {
      const errorMessage =
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "An unknown error occurred";
      toast.error(errorMessage)
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      const deleted = await dispatch(removeUser({ id: String(user.id), role: "admin" })).unwrap();
      // After deletion, refresh the user list:
      toast.success(deleted?.message)
      const refreshedUsers = await dispatch(fetchUsersByMerchantId(merchantId)).unwrap();
      setUsers(refreshedUsers ?? []);
    } catch (error) {
      const errorMessage =
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "An unknown error occurred";
      toast.error(errorMessage)
    }
  };

  const handleInviteUser = async (email: string, role: string) => {
    try {
      const invited = await dispatch(inviteUser({ email, role, merchant_id: merchantId })).unwrap();
      // Optionally refresh the user list after inviting:
      toast.success(invited?.message)
      const refreshedUsers = await dispatch(fetchUsersByMerchantId(merchantId)).unwrap();
      setUsers(refreshedUsers ?? []);
      setShowInviteModal(false);
    } catch (error) {
      const errorMessage =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : "An unknown error occurred";
      toast.error(errorMessage)
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="table-main">
        <div className="table-container user-table-container">
          <section className="table-header">
            <h1 className="table-heading">
              <i className="ri-table-line"></i> User Management
            </h1>
            {/* <div className="searchInput">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search users..."
                className="search-input"
              />
            </div> */}
          </section>
          <hr />
          <section className="table-body scroll">
            <table className="ledger">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Username</th>
                  <th style={{ textAlign: "center" }}>Role</th>
                  <th style={{ textAlign: "center" }}>Change Password</th>
                  <th style={{ textAlign: "center" }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      <div className="loader"></div>
                    </td>
                  </tr>
                ) : displayedUsers?.length === 0 || displayedUsers?.every((user) => user.delete_flag == 1) ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((user) =>
                    user?.delete_flag == 0 &&
                    (
                      <tr key={user.id}>
                        <td style={{ textAlign: "center" }}>{user.username}</td>
                        <td style={{ textAlign: "center" }}>{user.role}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn-circle small-btn-user"
                            onClick={() => handleChangePassword(user)}
                          >
                            <i className="ri-lock-line"></i>
                            <i className="ri-pencil-line overlay-icon"></i>
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn-circle small-btn-user"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </section>
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
        {showInviteModal && (
          <InviteUserModal
            onClose={() => setShowInviteModal(false)}
            onSubmit={handleInviteUser}
          />
        )}
      </div>
      <button className="btn-add" onClick={() => setShowInviteModal(true)}>
        <i className="ri-add-line" style={{ marginRight: "0.5rem" }}></i>
        Invite New User
      </button>
    </>
  );
};

export default UserManagement;
