import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/redux/store";
import { loginUser, registerUser, logout } from "@/src/redux/slices/userSlice";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const resultAction = await dispatch(registerUser({ username: name, email, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      router.push("/dashboard");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/");
  };

  return { login, register, logoutUser };
};
