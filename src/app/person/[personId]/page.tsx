import { ReactElement } from 'react'

interface PersonPageProps {
    params: Promise<{ personId: string }>
}

export default async function PersonPage({ params }: PersonPageProps): Promise<ReactElement> {
    const personId = (await params).personId
    return <div>PersonPage aktorId: {personId}</div>
}
