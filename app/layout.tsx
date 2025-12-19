
import React from 'react';
import './globals.css';

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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
