import "./globals.css";
import SiteDisclaimer from "../components/site-disclaimer";

export const metadata = {
  title: "Curator AI - AI Agent for Commerce Website",
  description:
    "Take-home exercise prototype: one agent for chat, product recommendation, and image-based product search.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container"
      >
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <SiteDisclaimer />
        </div>
      </body>
    </html>
  );
}
