import React, { ReactElement } from 'react'

interface EnBlokkProps extends React.HTMLAttributes<HTMLDivElement> {
    overskrift: string
}

export const DokumentFragment = ({ overskrift, children }: EnBlokkProps): ReactElement => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-900">{overskrift}</p>
            <p className="text-sm text-gray-700">{children}</p>
        </div>
    )
}
