export class StringUtil {
  public static truncate(value: string, length: number): string {
    return value.length > length ? (value.slice(0, length - 3) + '...') : value;
  }
}
