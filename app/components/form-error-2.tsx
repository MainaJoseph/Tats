import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorSecondProps {
  message?: string | null;
}

export const FormErrorSecond = ({ message }: FormErrorSecondProps) => {
  if (!message) return null;

  return (
    <div
      className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500"
      style={{ borderRadius: "10px" }}
    >
      <FaExclamationTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
