import { PropsWithChildren, ReactElement } from 'react'
import { PersonPencilFillIcon } from '@navikt/aksel-icons'

import { cn } from '@utils/tw'

export const kildeIcon: Record<string, ReactElement> = {
    SØKNAD: <SøknadKildeIcon />,
    INNTEKTSMELDING: <InntektsmeldingKildeIcon />,
    SAKSBEHANDLER: <SaksbehandlerKildeIcon />,
}

function SaksbehandlerKildeIcon(): ReactElement {
    return (
        <KildeIconWrapper className="bg-surface-subtle">
            <PersonPencilFillIcon />
        </KildeIconWrapper>
    )
}

function SøknadKildeIcon(): ReactElement {
    return <KildeIconWrapper className="border-border-alt-1 bg-surface-alt-1-subtle pt-px">SØ</KildeIconWrapper>
}

function InntektsmeldingKildeIcon(): ReactElement {
    return <KildeIconWrapper className="border-border-warning bg-surface-alt-2-subtle pt-px">IM</KildeIconWrapper>
}

function KildeIconWrapper({ className, children }: PropsWithChildren<{ className?: string }>): ReactElement {
    return (
        <div
            className={cn('flex h-[16px] w-[20px] items-center justify-center rounded-[3px] border text-xs', className)}
        >
            {children}
        </div>
    )
}
