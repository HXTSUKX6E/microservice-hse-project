// hooks/useLogin.ts
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

export function useLogin() {
    const [login, setLogin] = useState<string | null>(null)

    useEffect(() => {
        const fetchLogin = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await axios.get('http://localhost/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setLogin(response.data.login)
            } catch (error) {
                console.error('Ошибка при получении логина:', error)
            }
        }
        fetchLogin()
    }, [])

    return login
}