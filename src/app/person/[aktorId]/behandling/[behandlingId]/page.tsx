'use client'

import { ReactElement, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Page(): ReactElement {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        router.replace('/')
    }, [pathname, router])
    return <div></div>
}
