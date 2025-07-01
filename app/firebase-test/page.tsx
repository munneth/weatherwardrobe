"use client"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { signInAnonymously, User } from "firebase/auth"

export default function FirebaseTestPage() {
  const [status, setStatus] = useState("")
  const [user, setUser] = useState<User | null>(null)

  const testAnonymousAuth = async () => {
    try {
      setStatus("Testing anonymous auth...")
      const result = await signInAnonymously(auth)
      setUser(result.user)
      setStatus("Anonymous auth successful!")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setStatus(`Error: ${errorMessage}`)
      console.error("Auth error:", error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Firebase Test Page</h1>
        <p>Testing Firebase authentication configuration</p>
        
        <button 
          onClick={testAnonymousAuth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Anonymous Auth
        </button>
        
        <div className="mt-4">
          <p><strong>Status:</strong> {status}</p>
          {user && (
            <div>
              <p><strong>User ID:</strong> {user.uid}</p>
              <p><strong>Anonymous:</strong> {user.isAnonymous ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 