// core/pipes/role-name.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

const ROLE_MAP: Record<string, string> = {
  'ROLE_USER': 'Пользователь',
  'ROLE_MODERATOR': 'Модератор', 
  'ROLE_ADMIN': 'Администратор'
};

@Pipe({ name: 'roleName', standalone: true })
export class RoleNamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return ROLE_MAP[value] ?? value.replace('ROLE_', '');
  }
}