import pb from "@/lib/pocketbase";
import React, { useState } from "react";
import CustomToast, {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toaster/customToast";
const RequestEmailPass = () => {
  const [email, setEmail] = useState("");
  const requestChange = async (el) => {
    try {
      el.preventDefault();

      const user = await pb
        .collection("users")
        .getFirstListItem({ email: email });
      if (!user) {
        showErrorToast("Пользователя с таким email не существует");
        return;
      }

      await pb.collection("users").requestPasswordReset(email);
      showSuccessToast("Ссылка для смены пароля отправлена на вашу почту");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      showErrorToast("Не удалось отправить ссылку для смены пароля");
    }
  };

  return (
    <div className="request-style">
      <h1>Напишите ваш email</h1>
      <form onSubmit={requestChange}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" />
        <button type="submit">Подтвердить</button>
      </form>
      <CustomToast />
    </div>
  );
};

export default RequestEmailPass;
