export function erHelg(dato: Date): boolean {
    return dato.getDay() === 0 || dato.getDay() === 6
}
