'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Header } from '@/app/components/Header'
import AdminSidebar from '@/app/components/AdminSidebar'
import AuthGuard from '@/app/components/AuthGuard'
import useRole from '@/app/hooks/useRole'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ProfilePage() {
    const role = useRole()
    const [login, setLogin] = useState('')
    const [newLogin, setNewLogin] = useState('')
    const [oldLogin, setOldLogin] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [roleId, setRoleId] = useState<number | null>(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [showLoginChangeMessage, setShowLoginChangeMessage] = useState(false)
    const [isEditingLogin, setIsEditingLogin] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const response = await axios.get('http://localhost/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setLogin(response.data.login)
                setOldLogin(response.data.login)
                setNewLogin(response.data.login)
                setRoleId(response.data.role_id)
            } catch (err) {
                console.error(err)
                setError('Не удалось загрузить профиль')
            }
        }

        fetchProfile()
    }, [])

    useEffect(() => {
        const tokenFromQuery = searchParams.get('token')
        if (tokenFromQuery) {
            const confirmEmailChange = async () => {
                try {
                    // Ждём немного перед запросом (чтобы избежать гонки с рендером/авторизацией)
                    await new Promise(resolve => setTimeout(resolve, 500))

                    const response = await axios.get(`http://localhost/api/auth/confirm-email-change?token=${tokenFromQuery}`)

                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token)
                    }

                    setMessage('Логин успешно изменён')

                    setTimeout(() => {
                        router.push('/profile')
                    }, 5000)
                } catch (err) {
                    console.error(err)
                    setError('Не удалось подтвердить изменение логина')
                }
            }

            confirmEmailChange()
        }
    }, [searchParams, router])

    const handleLoginChange = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const response = await axios.put('http://localhost/api/auth/profile/change-login', {
                login_old: oldLogin,
                login: newLogin
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                setLogin(newLogin)
                setOldLogin(newLogin)
                setIsEditingLogin(false)
                setShowLoginChangeMessage(true)
            }
        } catch (err) {
            console.error(err)
            setError('Ошибка при изменении логина')
        }
    }

    useEffect(() => {
        if (showLoginChangeMessage) {
            const timer = setTimeout(() => setShowLoginChangeMessage(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [showLoginChangeMessage])

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [message])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const payload: any = {
                login,
                password: newPassword,
                role_id: role === 'Администратор' ? 1 : roleId
            }

            const response = await axios.put('http://localhost/api/auth/profile', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
            }

            setMessage('Профиль успешно обновлён!')
            setNewPassword('')
        } catch (err) {
            console.error(err)
            setError('Ошибка при обновлении профиля')
        }
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex flex-1">
                    {role === 'Администратор' && <AdminSidebar />}
                    <main className="flex-1 max-w-4xl mx-auto py-10 px-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Профиль пользователя</h1>

                        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.995 9.995 0 0112 15c2.21 0 4.244.716 5.879 1.924M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg text-gray-900 font-medium">Логин</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg text-gray-900 font-medium font-sans">{login}</span>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingLogin(true)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            изм.
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {showLoginChangeMessage && (
                                <div className="bg-green-100 text-green-800 p-4 rounded text-base">
                                    Подтвердите изменение логина на указанной почте!
                                </div>
                            )}

                            {message && (
                                <div className="bg-green-100 text-green-800 p-4 rounded text-base">{message}</div>
                            )}
                            {error && (
                                <div className="bg-red-100 text-red-800 p-4 rounded text-base">{error}</div>
                            )}

                            {isEditingLogin && (
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-1">
                                        Новый логин
                                    </label>
                                    <input
                                        type="text"
                                        value={newLogin}
                                        onChange={(e) => setNewLogin(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                                    />
                                    <button
                                        onClick={handleLoginChange}
                                        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition cursor-pointer"
                                    >
                                        Изменить логин
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-1">
                                        Новый пароль
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                                        required
                                    />
                                </div>

                                {role === 'Администратор' ? (
                                    <div>
                                        <label className="block text-base font-medium text-gray-900 mb-1">
                                            Роль
                                        </label>
                                        <div className="px-4 py-3 border border-gray-300 rounded-md text-gray-900 text-base bg-gray-100 cursor-not-allowed">
                                            Администратор
                                        </div>
                                    </div>
                                ) : role === 'Сотрудник' ? (
                                    <div>
                                        <label className="block text-base font-medium text-gray-900 mb-1">
                                            Роль
                                        </label>
                                        <div className="px-4 py-3 border border-gray-300 rounded-md text-gray-900 text-base bg-gray-100 cursor-not-allowed">
                                            Сотрудник
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-base font-medium text-gray-900 mb-1">
                                            Роль
                                        </label>
                                        <select
                                            value={roleId ?? ''}
                                            onChange={(e) => setRoleId(Number(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 text-base"
                                            required
                                        >
                                            <option value={2}>Пользователь</option>
                                            <option value={3}>Сотрудник</option>
                                        </select>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition text-base font-medium cursor-pointer"
                                    >
                                        Сохранить изменения
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
