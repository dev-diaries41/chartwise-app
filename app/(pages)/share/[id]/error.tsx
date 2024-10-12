'use client'
 
import DefaultError from '@/app/ui/common/not-found'
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
        <DefaultError title="404 | Analysis not found"  reset={reset}/>
    </div>
  )
}