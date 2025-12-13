import { useDispatch } from "react-redux";
import { setAuth, logout } from "@/src/redux/slices/userSlice";
import { authService } from "@/src/services/authService";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem("token", data.token);
    dispatch(setAuth(data));
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem("token", data.token);
    dispatch(setAuth(data));
    router.push("/dashboard");
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/");
  };

  return { login, register, logoutUser };
};
