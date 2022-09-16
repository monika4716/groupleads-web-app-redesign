import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'counterdisplayformate',
})
export class CounterdisplayformatePipe implements PipeTransform {
  transform(value: any): any {
    if (value > 999) {
      return Math.floor(value / 1000) + 'K+';
    } else {
      return value;
    }
  }
}
