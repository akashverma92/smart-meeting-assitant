"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}
