'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
})

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = (data: any) => {
        console.log(data) // Запрос к API
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Регистрация</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Поля формы аналогично странице логина */}
                {/* Добавьте поля name и confirmPassword */}

                <div className="text-center mt-4">
                    <span>Уже есть аккаунт? </span>
                    <a href="/login" className="text-blue-500">
                        Войти
                    </a>
                </div>
            </form>
        </div>
    )
}