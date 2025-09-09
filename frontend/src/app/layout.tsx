import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/Orderscontext';
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <main>{children}</main>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
