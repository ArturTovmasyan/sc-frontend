export class StringUtil {
  public static truncate(value: string, length: number): string {
    return value.length > length ? (value.slice(0, length - 3) + '...') : value;
  }

  public static extension(value: string): string {
    return value.slice((Math.max(0, value.lastIndexOf('.')) || Infinity) + 1);
  }
}
