import dayjs from 'dayjs'

export const NORSK_DATOFORMAT = 'DD.MM.YYYY'
export const NORSK_DATOFORMAT_MED_KLOKKESLETT = 'DD.MM.YYYY kl. HH.mm'
export const NORSK_LONG_MONTH_YEAR = 'MMMM YYYY'
export const NORSK_DATO_LONG_MONTH_YEAR = 'D. MMMM YYYY'

export const getFormattedDatetimeString = (datetime: string | null): string =>
    typeof datetime === 'string' ? dayjs(datetime).format(NORSK_DATOFORMAT_MED_KLOKKESLETT) : ''

export const getFormattedDateString = (date: string | null): string =>
    typeof date === 'string' ? dayjs(date).format(NORSK_DATOFORMAT) : ''

export const getFormattedNorwegianLongDate = (date: string | null): string =>
    typeof date === 'string' ? dayjs(date).format(NORSK_DATO_LONG_MONTH_YEAR) : ''

export const getFormattedMonthYear = (date: string | null): string =>
    typeof date === 'string' ? dayjs(date).format(NORSK_LONG_MONTH_YEAR) : ''

export const gyldigDatoFormat = (date?: Date | string): string => (date ? dayjs(date).format('YYYY-MM-DD') : '')
