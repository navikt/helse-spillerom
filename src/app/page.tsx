import React, { ReactElement } from 'react'

import { Testpersontabell } from '@components/testpersoner/Testpersontabell'

export default async function Page(): Promise<ReactElement> {
    return (
        <div className="p-8">
            <Testpersontabell />
        </div>
    )
}
