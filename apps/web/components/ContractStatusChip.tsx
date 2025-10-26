"use client";

export default function ContractStatusChip({ status }: { status: string }) {
  const color =
    status === "signed" ? "bg-green-600" : status === "cancelled" ? "bg-gray-500" : "bg-amber-600";
  const label = status;
  return <span className={`inline-block text-white text-xs px-2 py-0.5 rounded ${color}`}>{label}</span>;
}
