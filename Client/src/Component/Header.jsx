export const Header=({ title, subtitle, rightAction }) =>{
  return (
    <div className="flex items-center justify-between mb-6">
      
      {/* Left: Page title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Optional action button / content */}
      {rightAction && (
        <div>
          {rightAction}
        </div>
      )}
    </div>
  );
}
