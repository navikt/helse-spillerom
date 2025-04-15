import React, { PropsWithChildren } from 'react'

import styles from './SharedViews.module.css'

export const Saksbilde = ({ children }: PropsWithChildren) => {
    return <div className={styles.Content}>{children}</div>
}
