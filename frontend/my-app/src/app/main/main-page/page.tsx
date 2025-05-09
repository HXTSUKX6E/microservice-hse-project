
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('') // Состояние для поискового запроса
    const itemsPerPage = 6

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

    const slides = [
        '/images/slide1.jpg',
        '/images/slide2.jpg',
        '/images/slide3.jpg'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length])

    const getValue = (value: string | null) => value || 'Нет информации'

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth/login')
    }

    const handleOutsideClick = () => {
        if (showProfileMenu) setShowProfileMenu(false)
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
        <div className="min-h-screen bg-gray-50" onClick={handleOutsideClick}>
            {/* Слайдер */}
            <div className="relative h-64 bg-gray-200 overflow-hidden shadow-inner">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>
                ))}

                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-wrap justify-center gap-4 px-2">
                    {[{ title: '30', subtitle: 'направлений обучения', text: 'Более 30 направлений обучения по разным специальностям' },
                        { title: '80%', subtitle: 'практики', text: 'В ходе обучения 80% времени уделяется практике' },
                        { title: '850', subtitle: 'студентов', text: 'Ежегодно выпускается по разным специальностям' },
                        { title: '73', subtitle: 'года', text: 'Успешного существования нашего учебного центра' }]
                        .map((item, idx) => (
                            <div
                                key={idx}
                                className={`bg-white/[0.7] backdrop-blur-sm p-4 rounded-lg shadow-lg w-[180px] text-center transition-opacity duration-1000 ${currentSlide === 0 ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <h4 className="text-xl font-bold text-blue-700">{item.title}</h4>
                                <p className="text-sm font-semibold text-gray-800">{item.subtitle}</p>
                                <p className="text-xs text-gray-700">{item.text}</p>
                            </div>
                        ))}
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                    <Link
                        href="https://ykkperm.org/"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        target="_blank"
                    >
                        Образовательный центр
                    </Link>
                </div>

                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowProfileMenu(!showProfileMenu)
                        }}
                        className="bg-gray-200 rounded-full flex text-sm focus:outline-none p-2"
                    >
                        <span className="sr-only">Открыть меню профиля</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-30">
                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Настройки профиля
                            </Link>
                            <Link href="/reviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Отзывы
                            </Link>
                            <Link href="/resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Моё резюме
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Строка поиска */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Поиск по вакансии или компании..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // Плюс отступ для иконки
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
                                <div key={vacancy.vacancy_id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                                    <div className="px-4 py-5 sm:p-6 flex-grow">
                                        <h3 className="text-lg font-bold text-blue-700">{vacancy.title || 'Без названия'}</h3>
                                        <p className="mt-1 text-sm text-gray-600">{vacancy.name}</p>

                                        <div className="mt-4 space-y-2">
                                            <div className="text-black">
                                                <span className="font-bold text-gray-800">Компания:</span> {vacancy.company.name}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Описание:</span> {getValue(vacancy.description)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Контакты:</span> {getValue(vacancy.contact)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Опыт:</span> {getValue(vacancy.experience)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Формат:</span> {getValue(vacancy.format)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Адрес:</span> {getValue(vacancy.address)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">График:</span> {getValue(vacancy.schedule)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Часы (в нед.):</span> {getValue(vacancy.hours)}
                                            </div>
                                            <div className="text-black">
                                                <span className="font-medium text-blue-600">Обучение:</span> {vacancy.is_educated ? 'Да' : 'Нет'}
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
                                </div>
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
