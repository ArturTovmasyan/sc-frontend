export class DateHelper {
  public static convertUTC(date: string|Date) {
    const newDate = date instanceof Date ? date : new Date(date);
    return new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);
  }
}
