// hooks/useRole.ts
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useRole() {
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        const fetchRole = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await axios.get('http://localhost/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setRole(response.data.role)
            } catch (error) {
                console.error('Ошибка при получении роли:', error)
            }
        }
        fetchRole()
    }, [])

    return role
}