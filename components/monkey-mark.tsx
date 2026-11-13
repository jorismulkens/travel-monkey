import { cn } from "@/lib/utils";

interface MonkeyMarkProps {
  className?: string;
  size?: number;
  title?: string;
}

export function MonkeyMark({ className, size = 44, title }: MonkeyMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="24" cy="24" r="23" fill="#1E3B2D" />
      <path
        d="M24 8.5c2.6-2.3 6-2.2 7.3.1 1.2 2.1.3 4.8-1.8 6.6"
        stroke="#E86F3C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="12.4" cy="22.8" r="6.2" fill="#F1E5D2" />
      <circle cx="35.6" cy="22.8" r="6.2" fill="#F1E5D2" />
      <ellipse cx="24" cy="25.3" rx="13.2" ry="12.2" fill="#F1E5D2" />
      <ellipse cx="24" cy="27.7" rx="9.9" ry="8.6" fill="#FBF6EC" />
      <circle cx="19.6" cy="23.8" r="1.55" fill="#172E24" />
      <circle cx="28.4" cy="23.8" r="1.55" fill="#172E24" />
      <path
        d="M18.7 29.5c1.1 1 2.4 1.5 3.8 1.5 1.1 0 2.2-.4 3.2-1.1"
        stroke="#172E24"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="24" cy="27.9" r="1.15" fill="#E86F3C" />
      <path
        d="M21.2 31.3c1.7 1.6 3.9 1.6 5.6 0"
        stroke="#172E24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="38.5" cy="10" r="4.2" fill="#E86F3C" />
      <path
        d="M36.9 10h3.2M38.5 8.4v3.2"
        stroke="#FBF6EC"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
