export const OrderCompleteSkeleton = () => {
    return (
      <div className="flex flex-col items-center text-white text-center">
        <div className='flex flex-row gap-4 items-center mb-8'>
          <div className='w-10 h-10 bg-zinc-700 rounded-full animate-pulse' />
          <div className='w-20 h-6 bg-zinc-700 rounded-full animate-pulse' />
        </div>
        <div className="flex flex-col  mt-4 max-w-5xl mx-auto bg-transparent items-center text-center">
          <div className="h-12 w-full bg-zinc-700 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }