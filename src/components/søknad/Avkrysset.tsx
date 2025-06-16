import React from 'react'
import { CheckmarkIcon } from '@navikt/aksel-icons'

interface AvkryssetProps {
    tekst: string
}

const Avkrysset = ({ tekst }: AvkryssetProps) => {
    return (
        <div className="mt-1 flex items-center gap-2">
            <CheckmarkIcon aria-hidden={true} className="h-4 min-h-4 w-4 min-w-4" title="Avkrysset" />
            <span className="text-sm">{tekst}</span>
        </div>
    )
}

export default Avkrysset
