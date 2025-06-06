import React from "react";

import { formatDate } from "../../../utils/date";
import UserRole from "../UserRole";

const UserList = (props) => {
  const { users } = props;

  return (
    <div className="u-list">
      {users.map((user, index) => (
        <div key={index} className="mt-3 px-4 py-3 user-box">
          <label className="text-gray fw-semi-bold">Name</label>
          <p className="fw-medium">
            {user?.firstName ? `${user?.firstName} ${user?.lastName}` : "N/A"}
          </p>
          <label className="text-gray fw-semi-bold">Email</label>
          <p>{user?.email ?? "-"}</p>
          <label className="text-gray fw-semi-bold">Provider</label>
          <p>{user?.provider}</p>
          <label className="text-gray fw-semi-bold">Account Created</label>
          <p>{formatDate(user?.created)}</p>
          <label className="text-gray fw-semi-bold">Role</label>
          <p className="mb-0">
            <UserRole user={user} className="d-inline-block mt-2" />
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
