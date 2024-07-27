export class MediaQueryHandler {
  constructor(options) {
    let defaultOptions = {
      width: this.width,
      breakpoint: this.breakpoint,
      trueChange: () => { },
      falseChange: () => { },
    };
    this.options = Object.assign(defaultOptions, options);
    this.mediaQuery = window.matchMedia(`(${this.options.width}-width: ${this.options.breakpoint}px)`);
    this.mediaQuery.addEventListener("change", this.handleMediaChange.bind(this));
    this.initMedia();
  }

  initMedia() {
    if (this.mediaQuery.matches) {
      this.options.trueChange(this);
    } else {
      this.options.falseChange(this);
    }
  }

  handleMediaChange(event) {
    if (event.matches) {
      this.options.trueChange(this);
      return true
    } else {
      this.options.falseChange(this);
      return false
    }
  }
}