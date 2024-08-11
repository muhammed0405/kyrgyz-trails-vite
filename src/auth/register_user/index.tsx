/** @format */

import { useState } from "react";
import PocketBase from "pocketbase";

export default function RegisterPages() {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    emailVisibility: true,
    password: "",
    passwordConfirm: "",
    role: "user", // Default role
    verified: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a new user
      const record = await pb.collection("users").create(formData);

      if (formData.emailVisibility && !formData.verified) {
        console.log("Email verification is required.Please check your email");
      }

      // Request email verification
      await pb.collection("users").requestVerification(formData.email);

      console.log(
        "User created successfully. Please check your email for verification."
      );
      setError(null); // Clear any previous errors
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
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          type="password"
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
