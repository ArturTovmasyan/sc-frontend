export class DomHelper {
  private static rafAsync() {
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }

  public static checkElement(selector) {
    if (document.querySelector(selector) === null) {
      return DomHelper.rafAsync().then(() => DomHelper.checkElement(selector));
    } else {
      return Promise.resolve(true);
    }
  }
}
