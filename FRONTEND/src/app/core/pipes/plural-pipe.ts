import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: true // Важно для Angular 17+
})
export class PluralPipe implements PipeTransform {
  /**
   * @param count Количество
   * @param forms Массив из 3-х форм слова: [ '1 задача', '2 задачи', '5 задач' ]
   */
  transform(count: number, forms: string[]): string {
    if (!forms || forms.length !== 3) {
      return forms?.[0] || ''; // Фоллбэк на случай ошибки
    }

    const n = Math.abs(count);
    const n1 = n % 10;       // Последняя цифра
    const n2 = n % 100;      // Последние две цифры

    // Правило 1: 1, 21, 31, 101... (но не 11, 111...)
    if (n1 === 1 && n2 !== 11) {
      return forms[0];
    }
    
    // Правило 2: 2, 3, 4, 22, 23, 24, 102... (но не 12, 13, 14...)
    if (n1 >= 2 && n1 <= 4 && (n2 < 10 || n2 >= 20)) {
      return forms[1];
    }
    
    // Правило 3: 0, 5-20, 25-30, 11-14...
    return forms[2];
  }
}