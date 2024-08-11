/** @format */

import { useState } from "react";
import PocketBase from "pocketbase";

export default function Auth() {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    emailVisibility: true,
    password: "",
    passwordConfirm: "",
    role: "user", // Default role
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const record = await pb.collection("users").create(formData);
      await pb.collection("users").requestVerification(record.email);

      console.log(pb.authStore.isValid);
      console.log(pb.authStore.token);
      // console.log(pb.authStore.model.id)
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <div>
      <h1>Auth</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password" // Change to password type
          placeholder="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          type="password" // Change to password type
          placeholder="confirm password"
          value={formData.passwordConfirm}
          onChange={(e) =>
            setFormData({ ...formData, passwordConfirm: e.target.value })
          }
          required
        />
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guide">Guide</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
