'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Header } from "@/app/components/Header"
import Link from 'next/link'
import AuthGuard from "@/app/components/AuthGuard"
import useRole from "@/app/hooks/useRole"
import AdminSidebar from "@/app/components/AdminSidebar"

export default function CreateCompanyPage() {
    const router = useRouter()
    const role = useRole()
    const [formData, setFormData] = useState({
        name: '',
        inn: '',
        kpp: '',
        ogrn: '',
        address: '',
        director: '',
        date_reg: new Date().toISOString().split('T')[0],
        is_accepted: false
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/auth/login')
                return
            }

            await axios.post(
                'http://localhost/api/comp-vac/company',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            setSuccess('Компания успешно создана!')
            setTimeout(() => {
                router.push('/companies')
            }, 1500)
        } catch (error) {
            console.error('Ошибка создания компании:', error)
            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Ошибка при создании компании'
                    : 'Неизвестная ошибка'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex flex-1">
                    {role === "Администратор" && <AdminSidebar />}

                    <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Создание новой компании</h1>
                                <Link
                                    href="/companies"
                                    className="text-black hover:text-blue-800 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Назад к списку
                                </Link>
                            </div>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                    {success}
                                </div>
                            )}

                            <div className="bg-white shadow rounded-lg p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Название компании*', name: 'name' },
                                            { label: 'ИНН*', name: 'inn' },
                                            { label: 'КПП*', name: 'kpp' },
                                            { label: 'ОГРН*', name: 'ogrn' },
                                            { label: 'Директор*', name: 'director' }
                                        ].map(field => (
                                            <div key={field.name} className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={(formData as any)[field.name]}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                                    required
                                                />
                                            </div>
                                        ))}

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Юридический адрес*
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Дата регистрации*
                                            </label>
                                            <input
                                                type="date"
                                                name="date_reg"
                                                value={formData.date_reg}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex justify-end space-x-3">
                                            <Link
                                                href="/companies"
                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Отмена
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Создание...
                                                    </>
                                                ) : 'Создать компанию'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
