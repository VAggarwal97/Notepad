export function Button({ children, className = "", onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-xl shadow 
        bg-blue-600 text-white 
        hover:bg-blue-700 
        disabled:opacity-50 
        ${className}
      `}
    >
      {children}
    </button>
  );
}
