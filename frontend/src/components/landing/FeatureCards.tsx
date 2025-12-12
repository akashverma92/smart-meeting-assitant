// it contians the feature cards section of the landing page

"use client";

import { Copy, Mic, Video } from "lucide-react";

export default function FeatureCards() {
  return (
    <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      <FeatureCard
        icon={<Video className="w-6 h-6 text-blue-400" />}
        title="Crystal Clear Video"
        description="High-definition video calling powered by WebRTC."
      />

      <FeatureCard
        icon={<Mic className="w-6 h-6 text-indigo-400" />}
        title="Real-time AI Audio"
        description="Live transcription and smart audio processing."
      />

      <FeatureCard
        icon={<Copy className="w-6 h-6 text-purple-400" />}
        title="Smart Summaries"
        description="Automated meeting minutes and action item extraction."
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors backdrop-blur-sm">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
