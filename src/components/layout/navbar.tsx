import { Bell, Mail, Menu, ShoppingBag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useSidebar } from '../ui/sidebar'
import { UserOptions } from './user-options'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { useCartCount } from '@/hooks/useCartCount'

export const LayoutNavbar: React.FC = () => {
  const { openMobile, setOpenMobile } = useSidebar()
  const cartCount = useCartCount()

  const cartTo = '/cart' as const

  return (
    <nav className="w-full fixed p-2 bg-background border-border border-b">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => setOpenMobile(!openMobile)}
            size="icon"
            variant="ghost"
            className="h-8 md:hidden"
          >
            <Menu />
          </Button>

          <Link to="/dashboard">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="TradeSpace Logo" className="w-8" />
              <span className="md:text-lg font-bold">TradeSpace</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <Link to={cartTo} className="relative inline-flex items-center">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs rounded-full px-2 py-0.5 bg-primary text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <Button className="w-8 h-8 rounded-full" size="icon" variant="ghost">
            <Mail />
          </Button>
          <Button className="w-8 h-8 rounded-full" size="icon" variant="ghost">
            <Bell />
          </Button>
          <UserOptions />
        </div>
      </div>
    </nav>
  )
}
