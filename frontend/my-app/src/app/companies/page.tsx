// app/companies/page.tsx
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Header } from "@/app/components/Header"
import Link from 'next/link'
import AuthGuard from "@/app/components/AuthGuard"
import useRole from "@/app/hooks/useRole"
import AdminSidebar from "@/app/components/AdminSidebar"

type Company = {
    company_id: number
    name: string
    is_accepted: boolean
}

type FilterOption = 'all' | 'accepted' | 'pending'

export default function CompaniesPage() {
    const router = useRouter()
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<FilterOption>('all')
    const role = useRole()

    const itemsPerPage = 9

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

                const response = await axios.get('http://localhost/api/comp-vac/company', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                setCompanies(response.data)
            } catch (error) {
                console.error('Ошибка загрузки компаний:', error)
                setError('Произошла ошибка при загрузке данных компаний')
            } finally {
                setLoading(false)
            }
        }

        void fetchData()
    }, [router])

    // Фильтрация и пагинация
    const filteredCompanies = companies.filter(company => {
        // Фильтр по поиску
        const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())

        // Фильтр по статусу
        let matchesFilter = true
        if (filter === 'accepted') {
            matchesFilter = company.is_accepted
        } else if (filter === 'pending') {
            matchesFilter = !company.is_accepted
        }

        return matchesSearch && matchesFilter
    })

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex flex-1">
                    {role === "Администратор" && <AdminSidebar />}

                    <main className="flex-1">
                        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Поиск по названию компании..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value)
                                            setPage(1)
                                        }}
                                        className="w-full px-4 py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <span className="text-gray-700 whitespace-nowrap">Статус:</span>
                                    <select
                                        value={filter}
                                        onChange={(e) => {
                                            setFilter(e.target.value as FilterOption)
                                            setPage(1)
                                        }}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    >
                                        <option value="all">Все</option>
                                        <option value="accepted">Подтверждённые</option>
                                        <option value="pending">На модерации</option>
                                    </select>
                                </div>
                                {/* Добавленная кнопка "Добавить компанию" */}
                                {(role === "Администратор" || role === "Работодатель") && (
                                    <Link
                                        href="/companies/create"
                                        className="whitespace-nowrap px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Зарегистрировать компанию
                                    </Link>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
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
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {currentCompanies.map((company) => (
                                            <div
                                                key={company.company_id}
                                                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
                                            >
                                                <div className="px-4 py-5 sm:p-6">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                        {company.name}
                                                    </h3>
                                                    <p className={`text-sm font-medium ${
                                                        company.is_accepted ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {company.is_accepted ? 'Подтверждена' : 'На модерации'}
                                                    </p>
                                                    <div className="mt-4">
                                                        <Link
                                                            href={`/companies/${company.company_id}?from=company`}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            Подробнее →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {filteredCompanies.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            Компании не найдены
                                        </div>
                                    )}

                                    {totalPages > 0 && (
                                        <div className="flex justify-center items-center mt-8 gap-8">
                                            <button
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50 cursor-pointer"
                                            >
                                                Назад
                                            </button>

                                            <span className="text-gray-700 font-semibold w-40 text-center">
                                                Страница {page} из {totalPages}
                                            </span>

                                            <button
                                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={page === totalPages}
                                                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 cursor-pointer"
                                            >
                                                Вперёд
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}