import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-soft-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-500 text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                gradient:
                    "bg-gradient-primary text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                success:
                    "bg-gradient-success text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                danger:
                    "bg-gradient-danger text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                warning:
                    "bg-gradient-warning text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                info:
                    "bg-gradient-info text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                dark:
                    "bg-gradient-dark text-white shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5",
                outline:
                    "border-2 border-primary-500 text-primary-500 bg-white hover:bg-primary-50 shadow-soft-sm",
                ghost: "hover:bg-gray-100 hover:text-primary-600",
                link: "text-primary-500 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-3",
                sm: "h-9 rounded-soft-md px-4 text-xs",
                lg: "h-12 rounded-soft-xl px-8 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface GradientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
    ({ className, variant, size, asChild = false, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
                {children}
                {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
            </Comp>
        )
    }
)
GradientButton.displayName = "GradientButton"

export { GradientButton, buttonVariants }
