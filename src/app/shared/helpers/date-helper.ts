import * as moment from 'moment';

export class DateHelper {
  public static REGEX_LOCAL = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)$/;
  public static REGEX_UTC = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?Z$/;

  public static newDate(value?: any): Date {
    return typeof value === 'undefined' ? new Date() : new Date(value);
  }

  public static getPreviousYear() {
    const now = new Date();
    return new Date(now.setFullYear(now.getFullYear() - 1));
  }

  public static makeDateType(input: string|Date): Date {
    return input instanceof Date ? input : new Date(input);
  }

  public static makeDateOnly(input: string|Date): Date {
    const date: Date = DateHelper.makeDateType(input);
    date.setFullYear(date.getFullYear());
    date.setMonth(date.getMonth());
    date.setDate(date.getDate());
    date.setHours(0, 0, 0, 0);

    return date;
  }

  public static makeUTCDateOnly(input: string|Date): Date {
    const date: Date = DateHelper.makeDateType(new Date(input));
    date.setUTCFullYear(date.getFullYear());
    date.setUTCMonth(date.getMonth());
    date.setUTCDate(date.getDate());
    date.setUTCHours(0, 0, 0, 0);

    return date;
  }

  public static convertUTCString(formated: string): Date {
    const date = new Date(formated);
    return new Date( date.getTime() - date.getTimezoneOffset() * -60000 );

    // const groups = formated.match(DateHelper.REGEX_UTC);
    //
    // return new Date(Date.UTC(
    //   parseInt(groups[1], 10),
    //   parseInt(groups[2], 10) - 1,
    //   parseInt(groups[3], 10),
    //   parseInt(groups[4], 10),
    //   parseInt(groups[5], 10),
    //   parseInt(groups[6], 10),
    //   parseInt(groups[7], 10),
    // ));
  }

  public static formatMoment(date: Date, format: string, utc: boolean = false): string {
    return date ? (utc ? moment(date).utc().format(format) : moment(date).format(format) ) : null;
  }

  public static convertToUTC(date: string | Date) {
    const newDate = date instanceof Date ? date : new Date(date);
    return new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);
  }

  public static convertFromUTC(date: string | Date) {
    const newDate = date instanceof Date ? date : new Date(date);
    return new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
  }

  static getDateForKey(key: string): Date {
    const parts = key.split('-');

    return moment().month(parts[0]).year(parseInt('20' + parts[1], 10)).startOf('months').toDate();
  }
}
