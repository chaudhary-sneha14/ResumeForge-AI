export const Card=({ children, className = "" })=> {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
