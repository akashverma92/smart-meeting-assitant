"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect, useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { Eye, EyeOff } from "lucide-react";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Safety check: if Redux updates, we can also redirect here as a backup
  useEffect(() => {
    // console.log("Redux User updated:", user);
    if (user && user.role === 'admin') {
      // console.log("User is admin (redux), forcing redirect if not already there");
      // router.push('/admin/dashboard'); 
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // STOP PAGE RELOAD
    setLoading(true);
    try {
      console.log("Submitting login form...");
      // Explicitly wait for the result
      const resultUser: any = await login(email, password);
      console.log("Login Result Object:", resultUser);

      if (!resultUser) {
        alert("Error: Login returned null/undefined.");
        return;
      }

      console.log("Checking role...", resultUser.role);

      if (resultUser.role === 'admin') {
        console.log("Role is admin. Redirecting to /admin/dashboard");
        router.push('/admin/dashboard');
      } else {
        console.log("Role is " + resultUser.role + ". Redirecting to /dashboard");
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      // alert("Login failed: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <GoogleLoginButton />
      </CardContent>
    </Card>
  );
}
