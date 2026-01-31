
import { BarChart, MessagesSquare, Brain } from "lucide-react";
export default function FeatureCards() {
  return (
    <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      <FeatureCard
        icon={<Brain className="w-6 h-6 text-blue-400" />}
        title="AI-Led Interviews"
        description="Experience structured interviews hosted by AI that ask intelligent questions and guide the entire flow."
      />
      <FeatureCard
        icon={<MessagesSquare className="w-6 h-6 text-indigo-400" />}
        title="Adaptive Question Flow"
        description="Questions adapt dynamically based on your responses, helping assess depth, clarity, and understanding."
      />
      <FeatureCard
        icon={<BarChart className="w-6 h-6 text-purple-400" />}
        title="Interview Insights"
        description="Get clear feedback, summaries, and performance insights after every interview session."
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
    <div className="
      group
      relative
      p-8
      rounded-2xl
      bg-gradient-to-b from-white/[0.08] to-white/[0.02]
      border border-white/15
      shadow-lg shadow-black/20
      backdrop-blur-sm
      transition-all duration-300
      hover:-translate-y-2
      hover:shadow-blue-500/20
      hover:border-blue-500/40
    ">
      {/* Icon container */}
      <div className="
        w-14 h-14
        rounded-xl
        bg-gradient-to-br from-white/10 to-white/5
        flex items-center justify-center
        mb-6
        ring-1 ring-white/20
        group-hover:ring-blue-500/40
        transition-all
      ">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

