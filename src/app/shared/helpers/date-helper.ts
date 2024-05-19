export class DateHelper {
  public static convertUTC(date: string | Date) {
    const newDate = date instanceof Date ? date : new Date(date);
    return new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);
  }

  public static convertFromUTC(date: string | Date) {
    const newDate = date instanceof Date ? date : new Date(date);
    return new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
  }

  public static newDate() {
    const date: Date = new Date();
    date.setUTCFullYear(date.getFullYear());
    date.setUTCMonth(date.getMonth());
    date.setUTCDate(date.getDate());
    date.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

    return DateHelper.convertUTC(date);
  }

  public static magicDate(input: Date) {
    const date: Date = new Date(input);
    date.setUTCFullYear(date.getFullYear());
    date.setUTCMonth(date.getMonth());
    date.setUTCDate(date.getDate());
    date.setUTCHours(0, 0, 0, 0);

    return date;
  }
}
