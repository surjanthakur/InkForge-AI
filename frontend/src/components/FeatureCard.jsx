export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-10 md:p-12 h-full transition-all duration-300 hover:bg-zinc-100">
      <div className="mb-6">{icon}</div>

      <h3 className="text-xl font-serif font-medium mb-4">{title}</h3>

      <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
        {description}
      </p>
    </div>
  );
}
