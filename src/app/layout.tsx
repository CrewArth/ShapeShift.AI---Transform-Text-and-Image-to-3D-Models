'use client'

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { CreditsProvider } from '@/contexts/CreditsContext'
import CreditBalance from '@/components/CreditBalance'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ShapeShift.AI - Transform Ideas into 3D Reality</title>
        <link rel="icon" href="/ShapeShiftLogo.png" type="image/png" />
        <meta name="description" content="Transform your ideas into stunning 3D models using AI technology. Perfect for designers, developers, and creators." />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <ClerkProvider
            appearance={{
              baseTheme: dark,
              variables: { colorPrimary: '#8B5CF6' },
              elements: {
                formButtonPrimary: 'bg-purple-500 hover:bg-purple-600',
                footerActionLink: 'text-purple-500 hover:text-purple-600',
                card: 'bg-[var(--background-secondary)]',
                headerTitle: 'text-[var(--foreground)]',
                headerSubtitle: 'text-[var(--foreground-secondary)]',
                socialButtonsBlockButton: 'text-[var(--foreground)] border-[var(--border)]',
                socialButtonsBlockButtonText: 'text-[var(--foreground)]',
                formFieldLabel: 'text-[var(--foreground)]',
                formFieldInput: 'bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]',
                dividerLine: 'border-[var(--border)]',
                dividerText: 'text-[var(--foreground-secondary)]',
                formFieldAction: 'text-purple-500 hover:text-purple-600',
                userPreviewMainIdentifier: 'text-[var(--foreground)]',
                userPreviewSecondaryIdentifier: 'text-[var(--foreground-secondary)]',
                userButtonPopoverCard: 'bg-[var(--background)] border-[var(--border)]',
                userButtonPopoverActionButton: 'hover:bg-[var(--background-secondary)]',
                userButtonPopoverActionButtonText: 'text-[var(--foreground)]',
                userButtonPopoverActionButtonIcon: 'text-[var(--foreground)]'
              }
            }}
          >
            <NotificationProvider>
              <CreditsProvider>
                <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
                  {children}
                  <CreditBalance />
                </div>
              </CreditsProvider>
            </NotificationProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 