import React, { ReactElement } from 'react'
import { BodyShort, Dropdown, InternalHeader as Header } from '@navikt/ds-react'

import styles from './UserMenu.module.css'

export const UserMenu = (): ReactElement => {
    const navn = 'Saks Behandlersen'
    const ident = 's963852'
    return (
        <>
            <Dropdown>
                <Header.UserButton name={navn} description={ident} as={Dropdown.Toggle} />
                <Dropdown.Menu className={styles.UserMenu}>
                    <Dropdown.Menu.List>
                        <BodyShort className={styles.MenuItem}>
                            {navn}
                            <br />
                            {ident}
                        </BodyShort>
                        <Dropdown.Menu.Divider />
                        <Dropdown.Menu.List.Item as="a" className={styles.MenuItem}>
                            Logg ut
                        </Dropdown.Menu.List.Item>
                    </Dropdown.Menu.List>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}
