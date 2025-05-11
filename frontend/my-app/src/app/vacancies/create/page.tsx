'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function CreateVacancyPage() {
    const searchParams = useSearchParams()
    const companyId = searchParams.get('companyId')
    const router = useRouter()
    const [vacancy, setVacancy] = useState({
        name: '',
        title: '',
        description: '',
        contact: '',
        experience: '',
        format: '',
        address: '',
        schedule: '',
        hours: '',
        is_educated: false,
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!companyId) {
            setError('Не указана компания')
        }
    }, [companyId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!companyId) {
            setError('Не указана компания')
            return
        }

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Требуется авторизация')
                return
            }

            const response = await axios.post(
                'http://localhost/api/comp-vac/vacancy',
                {
                    ...vacancy,
                    company_id: Number(companyId),
                    isHidden: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            setSuccess(true)
            setTimeout(() => router.push(`/companies/${companyId}`), 1500)
        } catch (err) {
            console.error('Ошибка создания:', err)
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || 'Ошибка при создании вакансии'
                    : 'Неизвестная ошибка'
            )
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setVacancy(prev => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setVacancy(prev => ({ ...prev, [name]: checked }))
    }

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6">Создание новой вакансии</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-black px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-black px-4 py-3 rounded mb-4">
                            Вакансия успешно создана!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Название вакансии*
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={vacancy.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Заголовок*
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={vacancy.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                                Описание (до 1000 символов)
                            </label>
                            <textarea
                                name="description"
                                value={vacancy.description}
                                onChange={handleChange}
                                rows={5}
                                maxLength={1000}
                                className="w-full px-3 py-2 border rounded-md text-black bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Контактная информация*
                                </label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={vacancy.contact}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Требуемый опыт
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={vacancy.experience}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Формат работы
                                </label>
                                <input
                                    type="text"
                                    name="format"
                                    value={vacancy.format}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Адрес
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={vacancy.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    График работы
                                </label>
                                <input
                                    type="text"
                                    name="schedule"
                                    value={vacancy.schedule}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">
                                    Заработная плата
                                </label>
                                <input
                                    type="text"
                                    name="hours"
                                    value={vacancy.hours}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_educated"
                                checked={vacancy.is_educated}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label className="text-sm font-medium text-black">
                                Требуется обучение
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push(`/companies/${companyId}`)}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Опубликовать вакансию
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}