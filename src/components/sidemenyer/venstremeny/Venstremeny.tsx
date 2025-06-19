import { ReactElement } from 'react'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'

import { KategoriTag } from './KategoriTag'

export function Venstremeny(): ReactElement {
    return (
        <Sidemeny side="left">
            <KategoriTag />
        </Sidemeny>
    )
}
