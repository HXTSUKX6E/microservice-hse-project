'use client'
import { Header } from "@/app/components/Header"
import AdminSidebar from "@/app/components/AdminSidebar"
import AuthGuard from "@/app/components/AuthGuard"
import useRole from "@/app/hooks/useRole"
import TeenagerSidebar from "@/app/components/TeenagerSidebar";
import React from "react";
import EmployeeSidebar from "@/app/components/EmpoyeeSidebar"

export default function ReviewsPage() {
    const role = useRole()

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex flex-1">
                    {role === "Администратор" && <AdminSidebar />}
                    {role === 'Пользователь' && <TeenagerSidebar />}
                    {role === "Сотрудник" && <EmployeeSidebar />}

                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center p-6 max-w-md bg-white shadow-md rounded-2xl">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Страница на этапе разработки</h1>
                            <p className="text-gray-600">Мы работаем над этой страницей. Пожалуйста, зайдите позже.</p>
                            <div className="mt-6">
                                <svg className="mx-auto h-16 w-16 text-blue-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
