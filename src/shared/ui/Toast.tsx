import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in-up">
      <div className="rounded-xl bg-gray-800/90 px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm">
        {message}
      </div>
    </div>
  );
}
