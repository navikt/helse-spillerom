import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactElement } from 'react'
import { last } from 'remeda'

import styles from './NavLenke.module.css'

interface NavLenkeProps {
    tittel: string
    to: string
    disabled: boolean
}

export const NavLenke = ({ tittel, to, disabled }: NavLenkeProps): ReactElement => {
    const tab = last(usePathname().split('/'))
    return (
        <Link
            className={classNames(styles.NavLink, decodeURI(tab ?? '') === to && !disabled && styles.ActiveLink)}
            href={to}
            title={tittel}
        >
            {tittel}
        </Link>
    )
}
