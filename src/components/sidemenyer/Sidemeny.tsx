import { PropsWithChildren, ReactElement } from 'react'

import { cn } from '@utils/tw'

interface MenyProps extends PropsWithChildren {
    side: 'left' | 'right'
    className?: string
}

export function Sidemeny({ side, className, children }: MenyProps): ReactElement {
    const sideLabel = side === 'left' ? 'venstre' : 'høyre'

    return (
        <aside
            aria-label={`${sideLabel} sidemeny`}
            className={cn(
                // prettier-ignore
                'w-76 min-w-76 border-ax-border-neutral-subtle p-4',
                className,
                side === 'left' ? 'border-r' : 'border-l',
            )}
        >
            {children}
        </aside>
    )
}
