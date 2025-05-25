import getErrorMessage from "@/app/lib/utils/getErrorMessage"
import { FaCheckCircle } from "react-icons/fa"
import { FiAlertTriangle } from "react-icons/fi"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

export function successToast(title: string, text: string) {
  toast.custom((t) => (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center px-2"
        >
          <div className="bg-page text-color px-4 py-3 rounded-xl shadow-lg max-w-md w-full gap-2">
            <div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <strong className="text-green-300">{title}</strong>
                <FaCheckCircle className="text-green-300" />
              </div>
              <p className="break-words whitespace-normal">{text}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ))
}

export function failToast({
  title,
  message,
  error,
}: {
  title: string
  message?: string
  error?: unknown
}) {
  toast.custom((t) => (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center px-2"
        >
          <div className="bg-red-400 text-neutral-200 px-4 py-3 rounded-xl shadow-lg max-w-md w-full gap-3">
            <div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <strong className="text-white">{title}</strong>
                <FiAlertTriangle className="text-yellow-200" />
              </div>
              <p className="break-words whitespace-normal">
                {getErrorMessage(error) || message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ))
}
