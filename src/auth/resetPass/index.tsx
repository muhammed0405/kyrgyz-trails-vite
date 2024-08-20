import pb from "@/lib/pocketbase";

import React, { useState } from "react";

const ResetPass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  async function changePassword(e) {
    e.preventDefault();
    try {
      const currentUser = pb.authStore.model;

      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      const updatedUser = await pb.collection("users").update(currentUser.id, {
        oldPassword: oldPassword,
        password: newPassword,
        passwordConfirm: newPassword,
      });

      console.log("Password updated successfully:", updatedUser);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }

  return (
    <div>
      <form onSubmit={changePassword}>
        <div>
          <label htmlFor="oldPassword">Старый Пароль</label>
          <input type="text" onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="newPassword">Новый Пароль</label>
          <input type="text" onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="confirmPassword">Подтвердить Пароль</label>
          <input type="text" />
        </div>
        <button type="submit"> Подтвердить</button>
      </form>
    </div>
  );
};

export default ResetPass;
