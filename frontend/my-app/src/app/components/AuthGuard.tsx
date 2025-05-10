// components/AuthGuard.tsx
'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/auth/login'
            localStorage.removeItem('token')
            router.refresh()
        }
    }, [router])

    return <>{children}</>
}