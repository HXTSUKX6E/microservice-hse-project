// app/vacancies/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
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

export default function VacancyPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id
    const [vacancy, setVacancy] = useState<Vacancy | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
        }
    }, [router])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await axios.get(`http://localhost/api/comp-vac/vacancy/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    validateStatus: (status) => {
                        // Считаем успешными статусы 200-299 и 404
                        return (status >= 200 && status < 300) || status === 404;
                    }
                });

                if (response.status === 404) {
                    // Обработка случая, когда вакансия не найдена
                    setVacancy(null);
                    setError('Вакансия не найдена');
                } else {
                    setVacancy(response.data);
                    setError(null);
                }
            } catch (error) {
                console.error('Ошибка загрузки вакансии:', error);

                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        router.push('/auth/login');
                    } else if (error.response?.status === 404) {
                        setVacancy(null);
                        setError('Вакансия не найдена');
                    } else {
                        setError('Произошла ошибка при загрузке данных');
                        router.push('/main/main-page');
                    }
                } else {
                    setError('Неизвестная ошибка');
                    router.push('/main/main-page');
                }
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [id, router]);
    const getValue = (value: string | null) => value || 'Не указано'

    // Функция для форматирования даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Link
                    href="/main/main-page"
                    className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Назад к списку вакансий
                </Link>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : !vacancy ? (
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
                        <p className="text-lg font-semibold">Вакансия не найдена!</p>
                    </div>
                ) : (
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-blue-700">{vacancy.title || 'Без названия'}</h1>
                                    {/* Название компании с отдельным обработчиком клика */}
                                    <div
                                        className="text-black text-2xl font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/companies/${vacancy.company.company_id}?from=vacancy&vacancyId=${vacancy?.vacancy_id}`);
                                        }}
                                    >
                                        {vacancy.company.name}
                                    </div>
                                </div>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {vacancy.is_educated ? 'Требуется обучение' : 'Обучение не требуется'}
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание вакансии</h3>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {getValue(vacancy.description)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Требования</h3>
                                        <p className="text-gray-700">
                                            {getValue(vacancy.experience)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Детали</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div className="text-black">
                                                    <span className="font-medium">Адрес: </span>
                                                    ул. Сибирская, 45, Пермь
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="text-black">
                                                    <span className="font-medium">График работы: </span>
                                                    Сб-Вс, с 12:00 до 18:00
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <div className="text-black">
                                                    <span className="font-medium">Формат работы: </span>
                                                    Офис
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <div className="text-black">
                                                    <span className="font-medium">Эл. почта: </span>
                                                    {vacancy.company.userName}
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <div className="text-black">
                                                    <span className="font-medium">Контакт: </span>
                                                    <span className="font-medium"> {vacancy.contact} </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">О компании</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-black">
                                                {vacancy.company.name} - компания, зарегистрированная {formatDate(vacancy.company.date_reg)}.
                                            </p>
                                            <p className="text-black mt-2">
                                                <span className="font-medium">Юридический адрес:</span> {vacancy.company.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Откликнуться на вакансию
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}