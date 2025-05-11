// components/AdminSidebar.tsx
'use client'
import Link from 'next/link'

export default function AdminSidebar() {
    return (
        <div className="w-64 bg-gray-200 shadow-lg p-4 border-r border-gray-200 font-sans">
            <ul className="space-y-3">
                <li>
                    <Link
                        href="/main/main-page"
                        className="block p-3 hover:bg-gray-100 rounded transition text-gray-900 font-medium hover:text-blue-600 pl-4"
                    >
                        Управление вакансиями
                    </Link>
                </li>
                <li>
                    <Link
                        href="/companies"
                        className="block p-3 hover:bg-gray-100 rounded transition text-gray-900 font-medium hover:text-blue-600 pl-4"
                    >
                        Управление компаниями
                    </Link>
                </li>
                <li>
                    <Link
                        href="/reviews"
                        className="block p-3 hover:bg-gray-100 rounded transition text-gray-900 font-medium hover:text-blue-600 pl-4"
                    >
                        Отзывы
                    </Link>
                </li>
            </ul>
        </div>
    )
}