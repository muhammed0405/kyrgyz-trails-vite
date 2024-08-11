import React, { useState } from "react";

const ConfirmVerification = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you would typically send the code to your backend for verification
    if (code === "expectedCode") {
      // Replace 'expectedCode' with the actual expected code
      setMessage("Verification successful!");
    } else {
      setMessage("Invalid code. Please try again.");
    }
  };

  return (
    <div className="confirm-verification">
      <h2>Confirm Verification</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Verification Code:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ConfirmVerification;
