import { Home, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserOptions: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-8 h-8">
          <AvatarImage src="" alt="" />
          <AvatarFallback className="text-xs">TO</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>@tomasoh</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer transition justify-between">
          <span>Dashboard</span>
          <Home />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer transition justify-between">
          <span>My Profile</span>
          <User />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer transition justify-between">
          <span>Log Out</span>
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
