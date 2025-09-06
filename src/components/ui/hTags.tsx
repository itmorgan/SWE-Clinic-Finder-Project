import { cn } from "@/lib/utils";

export function H2(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn(
        "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight",
        props.className,
      )}
    />
  );
}

export function H3(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn(
        "text-xs sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight",
        props.className,
      )}
    />
  );
}

export function H4(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn(
        "text-[0.6rem] sm:text-[0.9rem] md:text-[1.1rem] lg:text-[1.3rem] tracking-tight ",
        props.className,
      )}
    />
  );
}