import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import {
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { auth, db } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { removeCartItem } from '@/api/cart/removeCartItem';
import { updateCartQuantity } from '@/api/cart/updateCartQuantity';
import { buildInvoicePdf, downloadPdf } from '@/lib/invoicePdf';

type CartItem = {
  id: string; // doc id
  listingId: string;
  tradespaceId: string;
  title: string;
  price: number;
  sellerName: string;
  imageUrl: string | null;
  quantity: number;
  condition: string;
};

export default function ShoppingCartView() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<Array<CartItem>>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'cartItems'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as Array<CartItem>;
      setCartItems(items);
    });

    return () => unsub();
  }, [user]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );
  const tax = subtotal * 0.08;
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = async (itemId: string, delta: number) => {
    if (!user) return;
    const item = cartItems.find((x) => x.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    await updateCartQuantity(user.uid, itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!user) return;
    await removeCartItem(user.uid, itemId);
  };

  async function handleCheckout() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Please log in to checkout.');
      return;
    }

    if (cartItems.length === 0) return;

    const invoiceBytes = await buildInvoicePdf({
      invoiceNumber: `TS-${Date.now()}`,
      buyerName: currentUser.displayName ?? 'TradeSpace User',
      buyerEmail: currentUser.email ?? undefined,
      logoUrl: '/logo.png',
      brandName: 'TradeSpace',
      items: cartItems.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.price,
        condition: i.condition,
        sellerName: i.sellerName,
        imageUrl: i.imageUrl,
      })),
      subtotal,
      tax,
      shipping,
      total,
      date: new Date(),
    });

    downloadPdf(invoiceBytes, `TradeSpace-Invoice-${Date.now()}.pdf`);

    setCartItems([]);
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Shopping Cart</h2>
        <p className="text-muted-foreground">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your
          cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Start adding products to your cart to see them here
              </p>
              <Button>Browse Products</Button>
            </Card>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="size-24 rounded-lg bg-muted overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl ?? ''}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>By {item.sellerName}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.condition}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive shrink-0"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <p className="text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h3 className="mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between mb-6">
              <span>Total</span>
              <span className="text-2xl">${total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mb-3"
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Tag className="size-4" />
              Apply Coupon
            </Button>

            {cartItems.length > 0 && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <TrendingUp className="size-4" />
                  <span>You're saving $45.00 from retail prices!</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
