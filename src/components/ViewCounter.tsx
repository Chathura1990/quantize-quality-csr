import { Eye } from "lucide-react";

interface ViewCounterProps {
  count: number;
}

const ViewCounter = ({ count }: ViewCounterProps) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-body">
      <Eye className="w-3.5 h-3.5" />
      {count} {count === 1 ? "view" : "views"}
    </span>
  );
};

export default ViewCounter;
