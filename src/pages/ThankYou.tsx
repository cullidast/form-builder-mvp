import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Спасибо!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Ваш ответ успешно отправлен. Мы свяжемся с вами в ближайшее время.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Если у вас есть вопросы, обратитесь в карьерный центр вашего университета.
          </p>
        </div>
      </div>
    </div>
  );
}
