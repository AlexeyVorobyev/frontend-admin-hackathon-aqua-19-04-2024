export const validateDate = (date: Date | string): boolean => {
    return !isNaN((new Date(date)).getTime())
}
