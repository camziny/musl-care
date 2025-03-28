'use client'

import { useState } from 'react'
import { resetAndInitializeDatabase } from '@/app/actions/resetDatabase'
import { useUser } from '@clerk/nextjs'

export default function ResetDbPage() {
  const { user, isLoaded } = useUser()
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the database? This will delete all data.')) {
      setIsLoading(true)
      try {
        const response = await resetAndInitializeDatabase()
        setResult(response)
      } catch (error) {
        setResult({ 
          success: false, 
          message: error instanceof Error ? error.message : 'An unknown error occurred' 
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!isLoaded) {
    return <div className="container mx-auto p-8">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-400 p-4 rounded">
          <p className="text-red-800 font-semibold">Not Authorized</p>
          <p className="text-red-700">
            You must be signed in to access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Database Reset Tool</h1>
      
      <div className="bg-blue-50 border border-blue-300 p-4 rounded mb-4">
        <p className="text-blue-800">Your Clerk User ID: <code className="bg-blue-100 px-2 py-1 rounded">{user.id}</code></p>
        <p className="text-blue-700 text-sm mt-1">
          This ID needs to be added to the ADMIN_USER_IDS array in src/app/actions/resetDatabase.ts to authorize you.
        </p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-400 p-4 rounded mb-6">
        <p className="text-yellow-800 font-semibold">⚠️ Warning</p>
        <p className="text-yellow-700">
          This will completely reset your database and recreate it with the new schema.
          All existing data will be lost!
        </p>
      </div>

      <button 
        onClick={handleReset}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Resetting...' : 'Reset Database'}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-semibold">{result.success ? 'Success!' : 'Error'}</p>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  )
} 