'use client'

import React, { ReactElement } from 'react'
import NextLink from 'next/link'
import { BodyShort, Detail, Dropdown, InternalHeader, Skeleton, Spacer } from '@navikt/ds-react'
import { InternalHeaderTitle } from '@navikt/ds-react/InternalHeader'
import { LeaveIcon } from '@navikt/aksel-icons'

import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'

export function Header(): ReactElement {
    const { data, isLoading } = useBrukerinfo()
    const laster = !data || isLoading
    return (
        <InternalHeader
            className="h-14"
            style={
                {
                    '--ac-internalheader-hover-bg': 'var(--a-green-700)',
                    '--ac-internalheader-bg': 'var(--a-green-500)',
                } as React.CSSProperties
            }
        >
            <InternalHeaderTitle as={NextLink} href="/">
                Manuell saksbehandling
            </InternalHeaderTitle>
            <Spacer />
            <Dropdown>
                {laster && <Skeleton className="m-2" variant="rectangle" width={180} height={40} />}
                {!laster && (
                    <>
                        <InternalHeader.UserButton as={Dropdown.Toggle} name={data.navn} />
                        <Dropdown.Menu>
                            <dl>
                                <BodyShort as="dt" size="small">
                                    {data.navn}
                                </BodyShort>
                                <Detail as="dd">{data.navIdent}</Detail>
                            </dl>
                            <Dropdown.Menu.Divider />
                            <Dropdown.Menu.List>
                                <Dropdown.Menu.List.Item as="a" href="/oauth2/logout">
                                    Logg ut <Spacer /> <LeaveIcon aria-hidden fontSize="1.5rem" />
                                </Dropdown.Menu.List.Item>
                            </Dropdown.Menu.List>
                        </Dropdown.Menu>
                    </>
                )}
            </Dropdown>
        </InternalHeader>
    )
}
