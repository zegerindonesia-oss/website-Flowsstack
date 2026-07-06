import * as React from "react"
export const Sheet = ({ children, open, onOpenChange }: any) => <div className="relative">{children}</div>
export const SheetTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => <div className="cursor-pointer inline-block">{children}</div>
export const SheetContent = ({ children, side, className }: any) => <div className={`fixed top-0 bottom-0 bg-white shadow-xl z-50 p-6 ${side === 'left' ? 'left-0' : 'right-0'} ${className}`}>{children}</div>