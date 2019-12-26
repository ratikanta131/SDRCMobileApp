import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

transform(arreng: any[], text: string): any[] {
if ( text === '' || text === undefined) {
  return arreng;
}

text = text.toLowerCase();

return arreng.filter( item => {
  return JSON.stringify(item.name).toLowerCase().includes(text);
});

}

}
