interface BlogStatusBadgeProps {
  status: string;
}

export function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const styles: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-800 border border-green-200",
    DRAFT: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    PENDING: "bg-primary/10 text-blue-800 border border-primary/30",
    REJECTED: "bg-red-100 text-red-800 border border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800 border border-gray-200"}`}
    >
      {status}
    </span>
  );
}
