import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../context/ThemeContext'
import ThemeSelector from '../components/ThemeSelector'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sajid Hussain - Portfolio',
  description: 'Full Stack Developer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
       
          {children}
        
      </body>
    </html>
  )
}
