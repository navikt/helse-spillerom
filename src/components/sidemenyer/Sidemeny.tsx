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
                'w-64 min-w-64 border-ax-border-neutral-subtle p-4 ax-xl:w-sm ax-xl:min-w-sm ax-lg:w-[19rem] ax-lg:min-w-[19rem]',
                className,
                side === 'left' ? 'border-r-1' : 'border-l-1',
            )}
        >
            {children}
        </aside>
    )
}
