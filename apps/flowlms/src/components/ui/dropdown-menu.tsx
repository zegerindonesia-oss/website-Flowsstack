import * as React from "react"
export const DropdownMenu = ({ children }: { children: React.ReactNode }) => <div className="relative group">{children}</div>
export const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => <>{children}</>
export const DropdownMenuContent = ({ children, align, className }: any) => <div className={`absolute top-full ${align === 'end' ? 'right-0' : 'left-0'} hidden group-hover:block bg-white border shadow-md rounded-md p-2 z-50 ${className}`}>{children}</div>
export const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>
export const DropdownMenuSeparator = () => <div className="h-px bg-muted my-1" />
export const DropdownMenuItem = ({ children, onClick, className }: any) => <div onClick={onClick} className={`cursor-pointer px-2 py-1.5 text-sm hover:bg-muted rounded-sm flex items-center ${className}`}>{children}</div>