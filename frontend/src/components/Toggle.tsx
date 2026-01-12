import { forwardRef } from "react";

type ToggleProps = {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    { checked = false, onChange, onCheckedChange},
    ref
  ) => {
    return (
      <div className="flex items-center">
        <label
          className="relative inline-block h-[16px] w-8 cursor-pointer"
        >
          <input
            type="checkbox"
            className="peer h-0 w-0 opacity-0"
            checked={checked}
            ref={ref}
            onChange={(e) => {
              onChange?.(e);
              onCheckedChange?.(e.target.checked);
            }}
          />

          {/* Track */}
          <span
            className={`absolute inset-0 rounded-full transition-colors duration-300 ${
              checked ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />

          {/* Thumb */}
          <span
            className={`absolute left-0.5 top-[1px] h-[14px] w-[14px] rounded-full bg-white transition-transform duration-300 ${
              checked ? "translate-x-[14px]" : ""
            }`}
          />
        </label>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
