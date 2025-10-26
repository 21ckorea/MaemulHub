import './globals.css';
import { ToastProvider } from "../components/ToastProvider";
import AppChrome from "../components/AppChrome";
export const metadata = { title: '매물허브', description: '부동산 매물/고객/계약 관리' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>
        <AppChrome>
          {children}
        </AppChrome>
        </ToastProvider>
      </body>
    </html>
  );
}
