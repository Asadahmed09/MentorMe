import { cn, getInitials, generateAvatarColor } from "../../utils/helpers";

interface AvatarProps {
  src?: string;
  firstName: string;
  lastName: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({
  src,
  firstName,
  lastName,
  size = "md",
  className,
}: AvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const fullName = `${firstName} ${lastName}`;
  const initials = getInitials(firstName, lastName);
  const bgColor = generateAvatarColor(fullName);

  if (src) {
    return (
      <img
        src={src}
        alt={fullName}
        className={cn(
          "rounded-full object-cover ring-2 ring-white",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white",
        sizeClasses[size],
        bgColor,
        className,
      )}
    >
      {initials}
    </div>
  );
}
