import getErrorMessage from "@/app/lib/utils/getErrorMessage"
import { FaCheckCircle } from "react-icons/fa"
import { FiAlertTriangle } from "react-icons/fi"
import { toast } from "sonner"


export function successToast(title: string, text: string) {
  toast.custom(() => (
    <div className="bg-page text-color px-4 py-3 rounded-xl shadow-lg gap-2">
      <div>
        <div className="flex items-center gap-2 whitespace-nowrap">

          <strong className="text-green-300">{title}</strong>
          <FaCheckCircle className="text-green-300" />
        </div>
        <p className="block whitespace-nowrap">{text}</p>
      </div>
    </div>
  ))

}

export function failToast({ title, message, error }: { title: string, message?: string, error?: unknown }) {
  toast.custom(() => (
    <div className="bg-red-400 text-neutral-200 px-4 py-3 rounded-xl shadow-lg gap-3">
      <div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <strong className="text-white">{title}</strong>
          <FiAlertTriangle className="text-yellow-200" />
        </div>

        <p className="block whitespace-nowrap">{getErrorMessage(error) || message}</p>
      </div>
    </div>
  ))
}

