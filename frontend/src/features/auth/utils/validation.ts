export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const passwordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};
