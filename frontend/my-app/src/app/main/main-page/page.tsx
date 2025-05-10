'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header} from "@/app/components/Header";

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
    userName: string
}

type Vacancy = {
    vacancy_id: number
    name: string
    title: string
    description: string | null
    company: Company
    contact: string
    experience: string | null
    format: string | null
    address: string | null
    schedule: string | null
    hours: string | null
    is_educated: boolean
}

export default function HomePage() {
    const router = useRouter()
    const [vacancies, setVacancies] = useState<Vacancy[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const itemsPerPage = 15

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
        }
    }, [router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost/api/comp-vac/vacancy', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setVacancies(response.data)
            } catch (error) {
                console.error('Ошибка загрузки вакансий:', error)
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/auth/login')
                }
            } finally {
                setLoading(false)
            }
        }

        void fetchData()
    }, [router])

    const getValue = (value: string | null) => value || 'Не указано'

    const handleOutsideClick = () => {
        // Обработчик клика вне меню профиля (теперь в компоненте Header)
    }

    // Фильтрация вакансий по имени
    const filteredVacancies = vacancies.filter(vacancy =>
        vacancy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentVacancies = filteredVacancies.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Строка поиска */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Поиск по вакансии или компании..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    {/* Иконка поиска (лупа) */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 4a7 7 0 11-7 7 7 7 0 017-7zM16 16l4 4"
                        />
                    </svg>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : currentVacancies.length === 0 ? (
                    <div className="flex justify-center items-center p-4 bg-red-100 text-red-800 rounded-md shadow-lg mt-4">
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
                        <p className="text-lg font-semibold">Вакансии не найдены!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {currentVacancies.map((vacancy) => (
                                <Link
                                    key={vacancy.vacancy_id}
                                    href={`/vacancies/${vacancy.vacancy_id}`}
                                    className="bg-white overflow-hidden shadow rounded-lg flex flex-col hover:shadow-lg transition-shadow"
                                >
                                    <div className="px-4 py-5 sm:p-6 flex-grow">
                                        <h3 className="text-lg font-bold text-blue-700">{vacancy.title || 'Без названия'}</h3>

                                        <div className="mt-4 space-y-2">
                                            <div className="text-black text-2xl font-semibold">
                                                {vacancy.company.name}
                                            </div>
                                            <div className="text-black text-lg">
                                                {getValue(vacancy.hours) !== 'Не указано' && (
                                                    <div className="text-black text-lg font-serif">
                                                        {getValue(vacancy.hours)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Адрес:</span> {getValue(vacancy.address)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">График:</span> {getValue(vacancy.schedule)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Кнопка отклика */}
                                    <div className="mt-auto px-4 py-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        >
                                            Откликнуться
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="flex justify-center items-center mt-8 gap-8">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50"
                            >
                                Назад
                            </button>

                            <span className="text-gray-700 font-semibold w-40 text-center">
                                Страница {page} из {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
                            >
                                Вперёд
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}