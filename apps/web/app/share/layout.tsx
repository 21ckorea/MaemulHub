export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      {children}
    </div>
  );
}
