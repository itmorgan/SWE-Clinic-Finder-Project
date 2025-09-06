interface BadgeProps {
  children: string;
}

export default function Badge({ children }: BadgeProps) {
  const bgColor = translateCrowd(children);

  return (
    <span
      className={`rounded border px-2 py-0.5 text-sm font-medium text-accent-foreground ${bgColor}`}
    >
      {children}
    </span>
  );
}

function translateCrowd(crowdness: string) {
  switch (crowdness) {
    case "Not crowded":
      return "bg-success ";
    case "Moderate crowd":
      return "bg-warning";
    case "Crowded":
      return "bg-destructive";
    default:
      return "bg-muted";
  }
}
