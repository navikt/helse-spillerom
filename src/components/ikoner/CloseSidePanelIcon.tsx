import { ReactElement, SVGProps } from 'react'

export const CloseSidePanelIcon = ({ fontSize = '1rem', ...props }: SVGProps<SVGSVGElement>): ReactElement => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={fontSize}
            height={fontSize}
            viewBox="0 0 24 24"
            fill="none"
            focusable={false}
            role="img"
            {...props}
        >
            <path
                fill="currentColor"
                d="M13.5 12 h-5.5 l2-2 a.5.5 0 0 0-.7-.7 l-3 3 a.5.5 0 0 0 0 .7 l3 3 a.5.5 0 0 0 .7-.7 L8 13 H13.5 a.6.6 0 0 0 0-1.2 z"
            />
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 3.25a.75.75 0 0 0-.75.75v16c0 .414.336.75.75.75h16a.75.75 0 0 0 .75-.75V4a.75.75 0 0 0-.75-.75zm10.25 1.5h-9.5v14.5h9.5zm1.5 14.5V4.75h3.5v14.5z"
            />
        </svg>
    )
}
