"use client"

import {erLokalEllerDemo} from "@/env";

type LayoutWrapperProps = {
    children: React.ReactNode
}

export const DemoPersonsok: React.FC<LayoutWrapperProps> = ({ children }) => {
    console.log(erLokalEllerDemo)

    if(!erLokalEllerDemo){
        return <>{children}</>
    }
    return (
        <div className="relative min-h-screen">
            {children}
            <button
                onClick={() => console.log('sdf')}
                className="fixed right-4 bottom-4 z-50 rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all hover:bg-blue-700"
                aria-label="Floating action button"
            >
                dsaf
            </button>
        </div>
    )
}
