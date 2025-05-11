// app/companies/[id]/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Header } from "@/app/components/Header"
import Link from 'next/link'
import AuthGuard from "@/app/components/AuthGuard"
import useRole from "@/app/hooks/useRole"
import AdminSidebar from "@/app/components/AdminSidebar"

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
    const searchParams = useSearchParams()
    const id = params.id
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusLoading, setStatusLoading] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editData, setEditData] = useState<Partial<Company>>({})
    const role = useRole()
    useEffect(() => {
        const fetchCompany = async () => {
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
                    setEditData(response.data)
                }
            } catch (error) {
                console.error('Ошибка загрузки компании:', error)
                setError('Произошла ошибка при загрузке данных компании')
            } finally {
                setLoading(false)
            }
        }

        void fetchCompany()
    }, [id, router])

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'Дата не указана'
            return date.toLocaleDateString('ru-RU')
        } catch {
            return 'Дата не указана'
        }
    }

    const handleVerify = async () => {
        if (!company) return

        try {
            setStatusLoading(true)
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/auth/login')
                return
            }

            await axios.put(
                `http://localhost/api/comp-vac/company-accept/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            setCompany(prev => prev ? { ...prev, is_accepted: true } : null)
        } catch (error) {
            console.error('Ошибка подтверждения компании:', error)
            setError('Не удалось верифицировать компанию')
        } finally {
            setStatusLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setStatusLoading(true)
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/auth/login')
                return
            }

            await axios.delete(`http://localhost/api/comp-vac/company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            router.push('/companies')
        } catch (error) {
            console.error('Ошибка удаления компании:', error)
            setError('Не удалось удалить компанию')
        } finally {
            setStatusLoading(false)
            setShowDeleteModal(false)
        }
    }

    const handleAdd = () => {
        router.push(`/vacancies/create?companyId=${id}`)
    }

    const handleEdit = async () => {
        if (!company) return

        try {
            setStatusLoading(true)
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/auth/login')
                return
            }

            const response = await axios.put(
                `http://localhost/api/comp-vac/company/${id}`,
                editData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            setCompany(response.data)
            setEditMode(false)
        } catch (error) {
            console.error('Ошибка редактирования компании:', error)
            setError('Не удалось обновить данные компании')
        } finally {
            setStatusLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex flex-1">
                    {role === "Администратор" && <AdminSidebar />}
                    <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
                            {error ? (
                                <>
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
                                </>
                            ) : loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : company ? (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <Link
                                            href={
                                                searchParams.get('from') === 'vacancy' && searchParams.get('vacancyId')
                                                    ? `/vacancies/${searchParams.get('vacancyId')}`
                                                    : searchParams.get('from') === 'company'
                                                        ? '/companies'
                                                        : '/main/main-page'
                                            }
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Назад
                                        </Link>

                                        {(role === "Администратор" || role === "Работодатель") && (
                                            <div className="relative inline-block z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('Current role:', role); // Добавляем лог для отладки
                                                        setShowMenu(!showMenu);
                                                    }}
                                                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    style={{ position: 'relative', zIndex: 10 }} // Явное указание z-index
                                                >
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
                                                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                                        />
                                                    </svg>
                                                </button>

                                                {showMenu && (
                                                    <div
                                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ position: 'absolute', zIndex: 50 }} // Явное указание z-index
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditMode(true);
                                                                    setShowMenu(false);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                            >
                                                                Редактировать
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowDeleteModal(true);
                                                                    setShowMenu(false);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-800"
                                                            >
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editData.name || ''}
                                                        onChange={handleInputChange}
                                                        className="text-2xl font-bold text-blue-700 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                                    />
                                                ) : (
                                                    <h1 className="text-2xl font-bold text-blue-700">{company.name}</h1>
                                                )}
                                                {role === "Администратор" && !company.is_accepted && (
                                                    <button
                                                        onClick={handleVerify}
                                                        disabled={statusLoading}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {statusLoading ? 'Верификация...' : 'Верифицировать'}
                                                    </button>
                                                )}
                                                {role === "Администратор" && company.is_accepted && (
                                                <div className="mb-4 flex justify-end">
                                                    <button
                                                        onClick={handleAdd}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none cursor-pointer"
                                                    >
                                                        Добавить вакансию
                                                    </button>
                                                </div>
                                                )}
                                            </div>

                                            {editMode ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-500">ИНН</label>
                                                                <input
                                                                    type="text"
                                                                    name="inn"
                                                                    value={editData.inn || ''}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-500">КПП</label>
                                                                <input
                                                                    type="text"
                                                                    name="kpp"
                                                                    value={editData.kpp || ''}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-500">ОГРН</label>
                                                                <input
                                                                    type="text"
                                                                    name="ogrn"
                                                                    value={editData.ogrn || ''}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-500">Юридический адрес</label>
                                                                <textarea
                                                                    name="address"
                                                                    value={editData.address || ''}
                                                                    onChange={handleInputChange}
                                                                    rows={3}
                                                                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-500">Директор</label>
                                                                <input
                                                                    type="text"
                                                                    name="director"
                                                                    value={editData.director || ''}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-500">Дата регистрации</label>
                                                                <input
                                                                    type="date"
                                                                    name="date_reg"
                                                                    value={editData.date_reg ? new Date(editData.date_reg).toISOString().split('T')[0] : ''}
                                                                    onChange={handleInputChange}
                                                                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-3 pt-4">
                                                        <button
                                                            onClick={() => setEditMode(false)}
                                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                                        >
                                                            Отмена
                                                        </button>
                                                        <button
                                                            onClick={handleEdit}
                                                            disabled={statusLoading}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {statusLoading ? 'Сохранение...' : 'Сохранить'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">ИНН</h3>
                                                            <p className="text-black text-lg">{company.inn || 'Не указано'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">КПП</h3>
                                                            <p className="text-black text-lg">{company.kpp || 'Не указано'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">ОГРН</h3>
                                                            <p className="text-black text-lg">{company.ogrn || 'Не указано'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">Юридический адрес</h3>
                                                            <p className="text-black text-lg">{company.address || 'Не указано'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">Директор</h3>
                                                            <p className="text-black text-lg">{company.director || 'Не указано'}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">Дата регистрации</h3>
                                                            <p className="text-black text-lg">{formatDate(company.date_reg)}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">Статус</h3>
                                                            <p className={`text-lg font-medium ${
                                                                company.is_accepted ? 'text-green-600' : 'text-yellow-600'
                                                            }`}>
                                                                {company.is_accepted ? 'Подтверждена' : 'На модерации'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </main>
                </div>
            </div>

            {/* Модальное окно подтверждения удаления */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
                        <p className="text-gray-600 mb-6">Вы уверены, что хотите удалить компанию "{company?.name}"? ВНИМАНИЕ! Это действие нельзя отменить.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={statusLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {statusLoading ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthGuard>
    )
}