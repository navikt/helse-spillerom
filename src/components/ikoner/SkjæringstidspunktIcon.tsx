import { ReactElement, SVGProps } from 'react'

export const SkjæringstidspunktIcon = ({ fontSize = '1rem', ...props }: SVGProps<SVGSVGElement>): ReactElement => {
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 2.25a.75.75 0 0 1 .75.75v1.25h4.5V3a.75.75 0 0 1 1.5 0v1.25h3.75c.69 0 1.25.56 1.25 1.25v13c0 .69-.56 1.25-1.25 1.25h-15c-.69 0-1.25-.56-1.25-1.25v-13c0-.69.56-1.25 1.25-1.25h3.75V3A.75.75 0 0 1 9 2.25M15.75 7a.75.75 0 0 1-1.5 0V5.75h-4.5V7a.75.75 0 0 1-1.5 0V5.75h-3.5v3.5h14.5v-3.5h-3.5zm-11 11.25v-7.5h14.5v7.5z"
            />
            <circle cx={12} cy={14.5} r={2.3} fill="#0063c1" />
        </svg>
    )
}
