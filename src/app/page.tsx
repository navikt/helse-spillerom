import React, { ReactElement } from 'react'

import { Testpersontabell } from '@components/testpersoner/Testpersontabell'
import {BodyLong, BodyShort} from "@navikt/ds-react";

export default async function Page(): Promise<ReactElement> {
    return (
        <div className="p-8">
            <BodyLong >Hello world</BodyLong>
        </div>
    )
}
