"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(name, email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </CardContent>
    </Card>
  );
}
