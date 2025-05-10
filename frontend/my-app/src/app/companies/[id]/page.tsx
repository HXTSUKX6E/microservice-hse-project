// app/companies/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Header } from "@/app/components/Header"
import Link from 'next/link'

type Company = {
    company_id: number
    name: string
    inn: string
    kpp: string
    ogrn: string
    address: string
    director: string
    date_reg: string
    is_accepted: boolean
}

export default function CompanyPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login')
                    return
                }

                const response = await axios.get(`http://localhost/api/comp-vac/company/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    validateStatus: (status) => (status >= 200 && status < 300) || status === 404
                })

                if (response.status === 404) {
                    setCompany(null)
                    setError('Компания не найдена')
                } else {
                    setCompany(response.data)
                }
            } catch (error) {
                console.error('Ошибка загрузки компании:', error)
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        router.push('/auth/login')
                    } else {
                        setError('Произошла ошибка при загрузке данных компании')
                    }
                } else {
                    setError('Неизвестная ошибка')
                }
            } finally {
                setLoading(false)
            }
        }

        void fetchData()
    }, [id, router])

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'Дата не указана'
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}.${month}.${year}`
        } catch {
            return 'Дата не указана'
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="mt-4 text-left">
                        <Link
                            href="/main/main-page"
                            className="inline-flex items-center justify-start mb-4 text-blue-600 hover:text-blue-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Назад к списку вакансий
                        </Link>
                    </div>
                    <div className="flex justify-center items-center p-4 bg-red-100 text-red-800 rounded-md shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c2 0 2 2 2 2s0 2-2 2s-2-2-2-2s0-2 2-2zm0 6c3.333 0 6 1.667 6 4s-2.667 4-6 4s-6-1.667-6-4s2.667-4 6-4z"
                            />
                        </svg>
                        <p className="text-lg font-semibold">{error}</p>
                    </div>

                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Link
                    href={
                        typeof window !== 'undefined' &&
                        new URLSearchParams(window.location.search).get('from') === 'vacancy' &&
                        new URLSearchParams(window.location.search).get('vacancyId')
                            ? `/vacancies/${new URLSearchParams(window.location.search).get('vacancyId')}`
                            : '/main/main-page'
                    }
                    className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Назад
                </Link>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : company ? (
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h1 className="text-2xl font-bold text-blue-700 mb-4">{company.name}</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-500">ИНН</h3>
                                        <p className="text-black">{company.inn || 'Не указано'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">КПП</h3>
                                        <p className="text-black">{company.kpp || 'Не указано'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">ОГРН</h3>
                                        <p className="text-black">{company.ogrn || 'Не указано'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-500">Юридический адрес</h3>
                                        <p className="text-black">{company.address || 'Не указано'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Директор</h3>
                                        <p className="text-black">{company.director || 'Не указано'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Дата регистрации</h3>
                                        <p className="text-black">{formatDate(company.date_reg)}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Статус</h3>
                                        <p className="text-black">
                                            {company.is_accepted ? 'Подтверждена' : 'На модерации'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center p-4 bg-red-100 text-red-800 rounded-md shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c2 0 2 2 2 2s0 2-2 2s-2-2-2-2s0-2 2-2zm0 6c3.333 0 6 1.667 6 4s-2.667 4-6 4s-6-1.667-6-4s2.667-4 6-4z"
                            />
                        </svg>
                        <p className="text-lg font-semibold">Компания не найдена!</p>
                    </div>
                )}
            </main>
        </div>
    )
}