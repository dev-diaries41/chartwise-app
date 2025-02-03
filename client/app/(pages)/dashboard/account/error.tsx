'use client'
 
import DefaultError from '@/app/ui/common/default-error'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
        <DefaultError title={`Error Fetching Account Information.`}  reset={reset}/>
    </div>
  )
}