
import React from 'react';

export const metadata = {
  title: 'Floripa Fácil - Traslados y Excursiones',
  description: 'Tu logística de confianza en el sur de Brasil',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-in.fade-in { animation: fadeIn 0.5s ease-out forwards; }
          .animate-in.slide-in-from-right { animation: slideInRight 0.3s ease-out forwards; }
        `}</style>
      </head>
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
