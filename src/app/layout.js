import { Kanit } from 'next/font/google';
import "@/app/globals.css";

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300'],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata = {
  title: "ระบบยืม-คืนครุภัณฑ์",
  description: "Borrow-Return Equipment System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
