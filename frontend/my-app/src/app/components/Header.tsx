// components/Header.tsx
'use client'
import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AuthGuard from "@/app/components/AuthGuard";
import axios from "axios";

export function Header() {
    const router = useRouter()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showProfileMenu, setShowProfileMenu] = useState(false)

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


    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth/login')
    }

    const handleOutsideClick = () => {
        if (showProfileMenu) setShowProfileMenu(false)
    }

    return (
        <AuthGuard>

        <div className="relative h-64 bg-gray-200 overflow-hidden shadow-inner" onClick={handleOutsideClick}>
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

            <div className="absolute top-4 right-4 z-20 ">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowProfileMenu(!showProfileMenu)
                    }}
                    className="bg-gray-200 rounded-full flex text-sm focus:outline-none p-2 cursor-pointer"
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
                        <Link href="/resume" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Резюме
                        </Link>
                        <Link href="/reviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Отзывы
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            Выйти
                        </button>
                    </div>
                )}
            </div>
        </div>
        </AuthGuard>
    )
}