import { OrderCompleteSkeleton } from "./order-complete";
import { ReceiptSkeleton } from "./receipt";

export function OrderSkeleton() {
    return (
      <div className='flex flex-col gap-8 justify-center items-center min-h-screen bg-zinc-900 py-16 px-4 sm:px-6'>
        <div className='flex flex-row items-left mr-auto gap-4'>
          <div className='w-6 h-6 bg-zinc-700 rounded-full animate-pulse' />
          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
        </div>
        <OrderCompleteSkeleton />
        <table className="w-full flex items-center justify-center">
          <tbody>
            <tr>
              <ReceiptSkeleton />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }