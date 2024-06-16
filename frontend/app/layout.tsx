import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/lib/providers/auth-provider'
import QueryProvider from '@/lib/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import AuthButton from '@/components/login/auth-button'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <AuthProvider>
        <QueryProvider>
          <body className={inter.className}>
            <div className={'flex justify-end border-b px-4 py-2'}>
              <AuthButton />
            </div>
            {children}
            <Toaster />
          </body>
        </QueryProvider>
      </AuthProvider>
    </html>
  )
}
