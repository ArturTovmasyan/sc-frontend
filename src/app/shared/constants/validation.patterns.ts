export class ValidationPatterns {
  public static PASSWORD = /(\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*)/;

  public static DOSAGE = /[^0-9\.\-\/]/;
  public static DOSAGE_UNIT = /[^a-zA-Z0-9\%\+\/]/;

  public static FLOOR = /(^[1-9][0-9]*$)/;

  public static GROUP_CAPACITY = /(^[1-9][0-9]*$)/;
  public static STATE_ABBR = /\b([A-Z]{2})\b/;
  public static ZIP_MAIN = /^[0-9]{5}([- ]?[0-9]{4})?/;
  public static PHONE = /(\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$)/;
}
