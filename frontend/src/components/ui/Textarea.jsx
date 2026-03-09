import { forwardRef } from "react";

const Textarea = forwardRef(({ className, error, label, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none ${error ? "border-red-300 focus:ring-red-500" : ""} ${className || ""}`}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
