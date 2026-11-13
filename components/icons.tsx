import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconBase>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 12H5" />
      <path d="m11 18-6-6 6-6" />
    </IconBase>
  );
}

export function MapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

export function Clock(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </IconBase>
  );
}

export function Calendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </IconBase>
  );
}

export function Compass(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3 5.3-2.2Z" />
    </IconBase>
  );
}

export function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function Close(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function Sun(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </IconBase>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </IconBase>
  );
}

export function Check(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4.5 4.5L19 6.5" />
    </IconBase>
  );
}

export function Wallet(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v12H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M4 8h16" />
      <circle cx="16.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function Mountain(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 19 6.5-11 4 6.5L16 11l5 8H3Z" />
      <path d="m9.5 8 1.6 2.7" />
    </IconBase>
  );
}

export function Footprints(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 11.5c-1.7 0-3-1.5-3-3.8C5.5 5.2 6.5 3 8.5 3s3 2.2 3 4.7c0 2.3-1.3 3.8-3 3.8Z" />
      <path d="M5.8 15.5h4.4c1.4 0 2.3 1.1 2 2.4-.2 1.1-1.2 1.6-2.8 1.6H7.7c-1.6 0-2.7-.6-2.7-1.8 0-1 .2-1.7.8-2.2Z" />
      <path d="M16 18c-1.2 0-2.1-1-2.1-2.5 0-1.7.7-3.2 2.1-3.2s2.1 1.5 2.1 3.2c0 1.5-.9 2.5-2.1 2.5Z" />
      <path d="M13.9 20.5h3.2c1 0 1.7.7 1.5 1.5" />
    </IconBase>
  );
}

export function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

export function Expand(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
    </IconBase>
  );
}

export function Leaf(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 4c-8.5 0-14 4.2-14 10.2A5.8 5.8 0 0 0 11.8 20C17.8 20 20 12.5 20 4Z" />
      <path d="M4 21c1-5 5-9 10-11" />
    </IconBase>
  );
}
