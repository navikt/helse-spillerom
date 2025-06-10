import { PropsWithChildren, ReactElement } from 'react'

import { cn } from '@utils/tw'

interface MenyProps extends PropsWithChildren {
    side: 'left' | 'right'
    className?: string
}

export function Sidemeny({ side, className, children }: MenyProps): ReactElement {
    return (
        <section
            className={cn('w-sm border-border-divider p-4', className, side === 'left' ? 'border-r-1' : 'border-l-1')}
        >
            {children}
        </section>
    )
}
