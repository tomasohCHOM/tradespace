import { Home, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserOptions: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-8 h-8">
          <AvatarImage
            src={user?.photoURL || ''}
            alt={user?.displayName || 'User Avatar'}
          />
          <AvatarFallback className="text-xs">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {user?.displayName || user?.email || 'User'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer transition justify-between">
          <span>Dashboard</span>
          <Home className="w-4 h-4" />
        </DropdownMenuItem>
        <a href="/settings">
          <DropdownMenuItem className="cursor-pointer transition justify-between">
            <span>Settings</span>
            <User className="w-4 h-4" />
          </DropdownMenuItem>
        </a>
        <DropdownMenuItem
          className="cursor-pointer transition justify-between"
          onClick={logout}
        >
          <span>Log Out</span>
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
