import { createFileRoute } from '@tanstack/react-router';
import ShoppingCartView from '@/components/cart/ShoppingCartView';

export const Route = createFileRoute('/_auth/cart')({
  component: ShoppingCartView,
});
