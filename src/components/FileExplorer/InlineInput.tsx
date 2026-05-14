import { useEffect, useRef, useState } from "react";

interface Props {
  initialValue: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function InlineInput({
  initialValue,
  onConfirm,
  onCancel,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm(value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onConfirm(value)}
      onClick={(e) => e.stopPropagation()}
      className={`
        flex-1 min-w-0 bg-transparent border border-[var(--accent)]
        outline-none rounded-sm px-1 py-px
        text-sm font-mono text-[var(--text)]
        caret-[var(--accent)]
      `}
    />
  );
}
