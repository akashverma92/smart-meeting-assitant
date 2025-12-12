"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const [socketStatus, setSocketStatus] = useState("Disconnected");

  useEffect(() => {
    // Test HTTP
    fetch("http://localhost:3001/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("Error connecting to backend"));

    // Test Socket
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      setSocketStatus(`Connected (ID: ${socket.id})`);
    });

    socket.on("disconnect", () => {
      setSocketStatus("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Smart Meeting Assistant</h1>

      <div className="flex flex-col gap-4 p-6 border rounded-lg shadow-md">
        <div>
          <span className="font-semibold">Backend HTTP Status: </span>
          <span>{message}</span>
        </div>

        <div>
          <span className="font-semibold">Socket Status: </span>
          <span className={socketStatus.includes("Connected") ? "text-green-500" : "text-red-500"}>
            {socketStatus}
          </span>
        </div>
      </div>
    </main>
  );
}
