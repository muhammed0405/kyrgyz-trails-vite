import { useState } from "react";
import PocketBase from "pocketbase";

export default function LoginPages() {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation before making the request
    if (!formData.email || !formData.password) {
      setError("email and password are required.");
      return;
    }

    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(formData.email, formData.password);

      localStorage.setItem("pocketbase_auth", JSON.stringify(authData));

      console.log("Login successful:", pb.authStore.isValid);
      console.log("Token:", pb.authStore.token);
      // console.log("User ID:", pb.authStore.model?.id);

      // Clear error on successful login
      setError(null);
    } catch (error: any) {
      console.error("Error logging in:", error);

      // Check for specific error codes or messages
      if (error.status === 400) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(
          error.message || "Failed to log in. Please check your credentials."
        );
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
