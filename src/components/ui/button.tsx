import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "outline" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-150 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 " +
  "whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  /* The money button. Accent, not brand, so it never disappears into a
     brand-coloured section — the single most common conversion leak on the
     competitor sites we benchmarked. */
  primary:
    "bg-accent-500 text-ink shadow-[0_1px_0_rgb(0_0_0/0.08),0_6px_18px_-8px_rgb(0_0_0/0.45)] hover:bg-accent-400",
  brand: "bg-brand-800 text-white hover:bg-brand-700",
  outline:
    "border border-line-strong bg-paper text-ink hover:border-brand-400 hover:bg-brand-50",
  ghost: "text-brand-800 hover:bg-brand-50",
  quiet: "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = cn(base, variants[variant], sizes[size], className);

  if (isExternal) {
    return <a href={href} className={classes} {...props} />;
  }
  return <Link href={href} className={classes} {...props} />;
}
