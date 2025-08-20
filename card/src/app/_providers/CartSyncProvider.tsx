"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { syncCart, syncServerCart, loadServerCart } from '../../store/cartSlice';
import { rabbitMQCartManager } from '@shop-micro/shared';

export default function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleCartUpdate = () => {
      dispatch(syncCart());
      dispatch(syncServerCart());
    };

    rabbitMQCartManager.subscribe('cart-updated', handleCartUpdate);
    rabbitMQCartManager.subscribe('cart-cleared', handleCartUpdate);

    // Initial sync - only sync to server, don't load from server
    dispatch(syncCart());
    dispatch(syncServerCart());

    return () => {
      rabbitMQCartManager.unsubscribe('cart-updated', handleCartUpdate);
      rabbitMQCartManager.unsubscribe('cart-cleared', handleCartUpdate);
    };
  }, [dispatch]);

  return <>{children}</>;
}

 
