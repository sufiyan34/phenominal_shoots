import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Phenomenal Shoots — Photography · Films · Stories",
  description: "Cinematic photography and videography studio."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider><Header/>{children}<Footer/></AuthProvider>
      </body>
    </html>
  );
}
