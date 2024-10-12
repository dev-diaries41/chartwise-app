import OrderSuccess from '@/app/ui/order/order-sucess';
import { OrderSkeleton } from '@/app/ui/skeletons/order-skeleton';
import { Suspense } from 'react';


export default function Page() {
    return (
      <Suspense fallback={<OrderSkeleton/>}>
        <OrderSuccess/>
      </Suspense>
    );
  };
    