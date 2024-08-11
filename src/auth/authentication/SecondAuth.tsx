/** @format */

import pb from "../../lib/pocketbase";
import { SubmitHandler, useForm } from "react-hook-form";
import useLogout from "../hooks/useLogout";
import useLogin from "../hooks/useLogin";

type FormData = {
  email: string;
  password: string;
};

export default function AuthSecond() {
  const logout = useLogout();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { login } = useLogin();
  const isLoggedIn = pb.authStore.isValid;
  const onSubmit: SubmitHandler<FormData> = (data: {
    email: string;
    password: string;
  }) => {
    console.log(data);
    login({ email: data.email, password: data.password });

    reset();
  };

  if (isLoggedIn) {
    return (
      <>
        <h1>Logged in: {pb.authStore.model?.email}</h1>
        <button onClick={logout}>Logout</button>
      </>
    );
  }
  return (
    <>
      {/* {isLoading && <p>Loading...</p>}
      {isError && <p style={{ color: "red" }}>Error</p>} */}
      <h1>Logged In: {isLoggedIn && pb.authStore.model?.email}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          id="email"
          type="text"
          placeholder="email"
          {...register("email")}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {/* <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading" : "Login"}
        </button> */}
      </form>
    </>
  );
}
