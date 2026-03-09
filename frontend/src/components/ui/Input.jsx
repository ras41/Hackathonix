import { forwardRef } from "react";

const Input = forwardRef(
  ({ className, type = "text", error, label, icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            type={type}
            className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${error ? "border-red-300 focus:ring-red-500" : ""} ${className || ""}`}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
