import { get } from "http";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "blue" | "red" | "green" | "zinc";
};

export function Button({ variant = "blue", children, ...props }: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-150 active:scale-95 flex " +
    "justify-center items-center gap-2 shadow-sm shadow-zinc-700 dark:shadow-zinc-300 w-40";

  const getStyles = () => {
    switch (variant) {
      case "blue":
        return "bg-blue-600 text-white shadow-sm hover:bg-blue-700";
      case "red":
        return "bg-red-600 text-white shadow-sm hover:bg-red-700";
      case "green":
        return "bg-green-600 text-white shadow-sm hover:bg-green-700";
      case "zinc":
        return "bg-zinc-600 text-white shadow-sm hover:bg-zinc-700";
      default:
        return "";
    }
  };

  return (
    <button className={`${base} ${getStyles()}`} {...props}>
      {children}
    </button>
  );
}
