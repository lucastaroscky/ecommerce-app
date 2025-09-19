import { AuthProvider } from './common/context/AuthContext';
import { CartProvider } from './common/context/CartContext';
import { OrdersProvider } from './common/context/Orderscontext';
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
