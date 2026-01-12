import { useState } from 'react'

interface ModalProps {
    tittel: string
    melding: string
    onBekreft: () => void
}

export const useBekreftelsesModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [modalProps, setModalProps] = useState<ModalProps | null>(null)

    const visBekreftelsesmodal = (props: ModalProps) => {
        setModalProps(props)
        setIsOpen(true)
    }

    const handleBekreft = () => {
        modalProps?.onBekreft()
        setIsOpen(false)
    }

    return {
        isOpen,
        setIsOpen,
        modalProps,
        visBekreftelsesmodal,
        handleBekreft,
    }
}
