import { PropsWithChildren, ReactElement } from 'react'

import { cn } from '@utils/tw'

interface MenyProps extends PropsWithChildren {
    side: 'left' | 'right'
}

export function Sidemeny({ side, children }: MenyProps): ReactElement {
    return (
        <section className={cn('w-sm border-border-divider', side === 'left' ? 'border-r-1' : 'border-l-1')}>
            {children}
        </section>
    )
}
