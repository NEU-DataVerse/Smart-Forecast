import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo-1.png" alt="Smart Forecast Logo" width={42} height={32} />
      <h1 className="text-slate-900 text-sm md:text-base font-semibold">Smart Forecast</h1>
    </div>
  );
}
