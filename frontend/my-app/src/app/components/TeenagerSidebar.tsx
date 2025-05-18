'use client'

import Link from 'next/link'
import { Briefcase, Building2, MessageSquareText } from 'lucide-react'

export default function TeenagerSidebar() {
    return (
        <div className="w-64 bg-white shadow-xl p-4 border-r border-gray-200 font-sans h-screen">
            {/*<h2 className="text-xl font-bold text-blue-600 mb-6 pl-2">Панель администратора</h2>*/}
            <ul className="space-y-3">
                <li>
                    <Link
                        href="/main/main-page"
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition text-gray-800 font-medium hover:text-blue-600 pl-4"
                    >
                        <Briefcase className="w-5 h-5" />
                        Вакансии
                    </Link>
                </li>
                <li>
                    <Link
                        href="/reviews"
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition text-gray-800 font-medium hover:text-blue-600 pl-4"
                    >
                        <MessageSquareText className="w-5 h-5" />
                        Отзывы
                    </Link>
                </li>
            </ul>
        </div>
    )
}
