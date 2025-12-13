import { useDispatch } from "react-redux";
import { setAuth, logout } from "@/src/redux/slices/userSlice";
import { authService } from "@/src/services/authService";

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem("token", data.token);
    dispatch(setAuth(data));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem("token", data.token);
    dispatch(setAuth(data));
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };

  return { login, register, logoutUser };
};
