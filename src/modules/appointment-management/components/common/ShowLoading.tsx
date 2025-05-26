import { CircularProgress } from "@heroui/react";

type Props = {
  readonly className?: string;
  readonly label?: string;
  readonly size?: "sm" | "md" | "lg";
};

function ShowLoading({ className, label, size = "md" }: Props) {
  return (
    <CircularProgress
      className={`w-full h-full flex items-center m-auto ${className}`}
      aria-label={label}
      size={size}
    />
  );
}

export default ShowLoading;
