interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm font-bold">SF</span>
      </div>
      <h1 className="text-slate-900 text-sm md:text-base font-semibold">Smart Forecast</h1>
    </div>
  );
}
