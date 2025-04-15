import React from 'react'
import { Button } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'

export const NesteSteg = (p: { nesteFane: string }) => {
    const router = useRouter()

    return (
        <Button
            className="my-8"
            onClick={() => {
                router.push(p.nesteFane)
            }}
        >
            Neste steg
        </Button>
    )
}
