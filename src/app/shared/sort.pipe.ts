import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform<T>(
    items: T[],
    property: keyof T,
    isAscending: boolean = true
  ): T[] {
    if (!items || !property) {
      return items
    }

    return [...items].sort((a, b) => {
      const valueA = String(a[property]).toLowerCase()
      const valueB = String(b[property]).toLowerCase()

      if (valueA < valueB) return isAscending ? -1 : 1
      if (valueA > valueB) return isAscending ? 1 : -1
      return 0
    })
  }
}
