import React, { ReactElement } from 'react'

import { KjønnsnøytraltIkon } from '@/components/ikoner/KjønnsnøytraltIkon'

export const GenderIcon = ({ ...svgProps }: React.SVGAttributes<SVGElement>): ReactElement => {
    return <KjønnsnøytraltIkon alt="Ukjent" {...svgProps} />
}
