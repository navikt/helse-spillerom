import dayjs from 'dayjs'

export const NORSK_DATOFORMAT_MED_KLOKKESLETT = 'DD.MM.YYYY kl. HH.mm'

export const getFormattedDatetimeString = (datetime: string): string =>
    dayjs(datetime).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)
