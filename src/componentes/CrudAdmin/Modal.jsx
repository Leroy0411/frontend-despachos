export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
