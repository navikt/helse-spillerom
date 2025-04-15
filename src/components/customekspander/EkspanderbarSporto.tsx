import React, { PropsWithChildren, useState } from 'react'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Heading } from '@navikt/ds-react'

const ExpandableComponent = ({ header, children }: PropsWithChildren<{ header: string }>) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen((prev) => !prev)

    return (
        <div className="py-4">
            <button
                type="button"
                onClick={toggleOpen}
                //hover med grå bakgrunn og hånd som musepeker
                className="flex justify-between items-center w-full px-4 py-2 text-left focus:outline-none hover:bg-gray-50 cursor-pointer hover:rounded"
            >
                <Heading size="xsmall" level="2">
                    {header}
                </Heading>
                <ChevronDownIcon
                    className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && <div className="px-4 py-2">{children}</div>}
        </div>
    )
}

export default ExpandableComponent
