'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetDbPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/')
  }, [router])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">This feature has been removed</h1>
      <p className="mb-4">For security reasons, the database reset functionality has been removed from the application.</p>
      <p>You will be redirected to the home page momentarily...</p>
    </div>
  )
} 