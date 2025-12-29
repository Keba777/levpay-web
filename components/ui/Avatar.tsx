import { cn } from "@/lib/utils"

interface AvatarProps {
    src?: string
    alt?: string
    fallback: string
    className?: string
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
    return (
        <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-mint-green", className)}>
            {src ? (
                <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-mint-green text-deep-teal font-bold text-sm uppercase">
                    {fallback.substring(0, 2)}
                </div>
            )}
        </div>
    )
}
