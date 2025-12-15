import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loginUser, registerUser, fetchMe, logout } from "@/redux/slices/userSlice";
import { authService } from "@/src/services/authService";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  const login = (data: { email: string; password: string }) => dispatch(loginUser(data));
  const register = (data: { username: string; email: string; password: string }) => dispatch(registerUser(data));
  const googleLogin = () => window.location.href = authService.googleAuthUrl();
  const fetchUser = () => dispatch(fetchMe());
  const logoutUser = () => dispatch(logout());

  return { user, loading, error, login, register, googleLogin, fetchUser, logoutUser };
};
