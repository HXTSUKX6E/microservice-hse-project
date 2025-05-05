'use client'
import { useForm } from 'react-hook-form'

export default function ForgotPasswordPage() {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data: any) => {
        console.log(data) // Отправка email для сброса пароля
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Восстановление пароля</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Отправить инструкции
                </button>

                <div className="text-center mt-4">
                    <a href="/login" className="text-blue-500">
                        Вернуться к входу
                    </a>
                </div>
            </form>
        </div>
    )
}