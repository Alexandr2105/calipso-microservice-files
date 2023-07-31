import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDateInFormat', async: false })
export class IsDateInFormat implements ValidatorConstraintInterface {
  validate(value: string) {
    // Регулярное выражение для соответствия формату dd.mm.yyyy
    const regex = /^([0-2][0-9]|3[0-1]).(0[1-9]|1[0-2]).\d{4}$/;

    if (!regex.test(value)) {
      return false;
    }

    // Извлечение дня, месяца и года из строки даты
    const [day, month, year] = value.split('.');

    // Преобразование дня, месяца и года в числа
    const dayNumber = parseInt(day, 10);
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    // Проверка на валидность даты
    return this.isValidDate(dayNumber, monthNumber, yearNumber);
  }

  private isValidDate(day: number, month: number, year: number): boolean {
    if (month < 1 || month > 12) {
      return false;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    return !(day < 1 || day > daysInMonth);
  }

  defaultMessage() {
    return 'Неверный формат даты или значение.';
  }
}
