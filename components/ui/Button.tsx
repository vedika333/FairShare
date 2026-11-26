import type { ButtonHTMLAttributes } from "react";

type Variant = "rose" | "ink" | "soft";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  rose: "bg-rose text-card border-[1.5px] border-ink shadow-[3px_3px_0_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  ink: "bg-ink text-card border-[1.5px] border-ink shadow-[3px_3px_0_0_var(--color-rose)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  soft: "bg-peach/60 text-ink border-[1.5px] border-ink/30 hover:border-ink/60 active:scale-[0.98]",
};

// Tactile button with three visual styles matching the warm stationery theme
export function Button({
  variant = "rose",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all disabled:opacity-55 disabled:pointer-events-none cursor-pointer ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
