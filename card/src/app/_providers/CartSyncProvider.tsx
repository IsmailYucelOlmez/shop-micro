"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { syncCart } from '../../store/cartSlice';
import { rabbitMQCartManager } from '@shop-micro/shared';

export default function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Listen for cart updates from other applications via RabbitMQ
    const handleCartUpdate = () => {
      dispatch(syncCart());
    };

    rabbitMQCartManager.subscribe('cart-updated', handleCartUpdate);
    rabbitMQCartManager.subscribe('cart-cleared', handleCartUpdate);

    // Initial sync
    dispatch(syncCart());

    return () => {
      rabbitMQCartManager.unsubscribe('cart-updated', handleCartUpdate);
      rabbitMQCartManager.unsubscribe('cart-cleared', handleCartUpdate);
    };
  }, [dispatch]);

  return <>{children}</>;
}
