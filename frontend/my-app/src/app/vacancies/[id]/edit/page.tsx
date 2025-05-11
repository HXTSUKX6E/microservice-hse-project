'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function EditVacancyPage() {
    const router = useRouter()
    const { id } = useParams()
    const [vacancy, setVacancy] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`http://localhost/api/comp-vac/vacancy/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setVacancy(response.data)
            } catch (err) {
                console.error('Ошибка загрузки вакансии:', err)
                setError('Не удалось загрузить вакансию')
            } finally {
                setLoading(false)
            }
        }

        fetchVacancy()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vacancy || !vacancy.company?.company_id) {
            setError('Отсутствует информация о компании');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Требуется авторизация');
                return;
            }

            console.log('Отправляемые данные:', {
                name: vacancy.name,
                title: vacancy.title,
                description: vacancy.description,
                company_id: vacancy.company.company_id,
                contact: vacancy.contact,
                experience: vacancy.experience,
                format: vacancy.format,
                address: vacancy.address,
                schedule: vacancy.schedule,
                hours: vacancy.hours,
                is_educated: vacancy.is_educated,
                isHidden: vacancy.isHidden
            });

            const response = await axios.put(
                `http://localhost/api/comp-vac/vacancy/${id}`,
                {
                    name: vacancy.name,
                    title: vacancy.title,
                    description: vacancy.description,
                    company_id: Number(vacancy.company.company_id),
                    contact: vacancy.contact,
                    experience: vacancy.experience,
                    format: vacancy.format,
                    address: vacancy.address,
                    schedule: vacancy.schedule,
                    hours: vacancy.hours,
                    is_educated: vacancy.is_educated,
                    // isHidden: vacancy.isHidden
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Ответ сервера:', response.data);
            setSuccess(true);
            setTimeout(() => router.push(`/vacancies/${id}`), 1500);
        } catch (err) {
            console.error('Полная ошибка:', err);
            if (axios.isAxiosError(err)) {
                console.error('Детали ошибки:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    config: err.config
                });
                setError(err.response?.data?.message || 'Ошибка при обновлении вакансии');
            } else {
                setError('Неизвестная ошибка');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setVacancy((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setVacancy((prev: any) => ({ ...prev, [name]: checked }))
    }

    if (loading) return <div className="text-center py-8 text-black">Загрузка...</div>
    if (!vacancy) return <div className="text-center py-8 text-black">Вакансия не найдена</div>

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-black">Редактирование вакансии</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-black px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-black px-4 py-3 rounded mb-4">
                            Вакансия успешно обновлена!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Название вакансии*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={vacancy.name || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Заголовок*</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={vacancy.title || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">Описание (до 1000 символов)</label>
                            <textarea
                                name="description"
                                value={vacancy.description || ''}
                                onChange={handleChange}
                                rows={5}
                                maxLength={1000}
                                className="w-full px-3 py-2 border rounded-md text-black bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Контактная информация*</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={vacancy.contact || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Требуемый опыт (до 1000 символов)</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={vacancy.experience || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    maxLength={1000}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Формат работы</label>
                                <input
                                    type="text"
                                    name="format"
                                    value={vacancy.format || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Адрес (до 1000 символов)</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={vacancy.address || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                    maxLength={1000}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">График работы</label>
                                <input
                                    type="text"
                                    name="schedule"
                                    value={vacancy.schedule || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-black">Заработная плата</label>
                                <input
                                    type="text"
                                    name="hours"
                                    value={vacancy.hours || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md text-black bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_educated"
                                    checked={vacancy.is_educated || false}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-black">
                                    Требуется обучение
                                </label>
                            </div>

                            {/*<div className="flex items-center space-x-2">*/}
                            {/*    <input*/}
                            {/*        type="checkbox"*/}
                            {/*        name="isHidden"*/}
                            {/*        checked={vacancy.isHidden || false} // Инвертируем для отображения*/}
                            {/*        onChange={handleCheckboxChange}*/}
                            {/*        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"*/}
                            {/*    />*/}
                            {/*    <label className="text-sm font-medium text-black">*/}
                            {/*        Скрыть вакансию*/}
                            {/*    </label>*/}
                            {/*</div>*/}
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push(`/vacancies/${id}`)}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100 text-black"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}