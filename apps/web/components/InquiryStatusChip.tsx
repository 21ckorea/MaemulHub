"use client";

export default function InquiryStatusChip({ status }: { status: string }) {
  const color =
    status === "new"
      ? "bg-blue-100 text-blue-700"
      : status === "in_progress"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";
  const label =
    status === "new"
      ? "새 요청"
      : status === "in_progress"
      ? "진행중"
      : status === "closed"
      ? "종료"
      : status;
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${color}`}>{label}</span>
  );
}
