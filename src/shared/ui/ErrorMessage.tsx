interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm leading-relaxed text-red-500 break-keep wrap-break-word">
      {message}
    </div>
  );
}
