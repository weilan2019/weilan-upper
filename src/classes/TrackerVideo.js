class TrackerVideo {
  constructor({
    FPS = 30,
    inputElement,
    outputElement,
    init,
    frames,
    nextTick
  }) {
    if (FPS === 0) {
      console.warn("FPS is 0, disable opencv.");
      return;
    }
    this.$FPS = FPS;
    this.$delay = Math.floor(1000 / FPS);
    this.$el =
      inputElement instanceof HTMLElement ?
      inputElement :
      document.querySelector(inputElement);
    this.$outputel =
      outputElement instanceof HTMLElement ?
      outputElement :
      document.querySelector(outputElement);

    let isvideo = this.$el.tagName === "VIDEO";
    if (isvideo) this.$capture = new cv.VideoCapture(this.$el);
    this.$frame = new cv.Mat(this.$el.height, this.$el.width, cv.CV_8UC4);
    this.$frames = frames && frames.bind(this);

    if (init !== undefined) {
      var DataObj = {};
      init.call(this, DataObj).then(cvDataObj => {
        if (cvDataObj instanceof Function) {
          this.$frames = cvDataObj;
          cvDataObj = DataObj;
        } else if (cvDataObj === undefined) cvDataObj = DataObj;
        this._cvDataObj = cvDataObj;
        for (let key in cvDataObj) this[key] = cvDataObj[key];

        let catcherr = false;
        let frameFunc = isvideo ?
          () => {
            this.$capture.read(this.$frame);
            cv.imshow(this.$outputel, this.$frames(this.$frame));
            // this.$frame.delete();
          } :
          () => {
            try {
              this.$frame = cv.imread(this.$el);
              cv.imshow(this.$outputel, this.$frames(this.$frame));
            } catch (e) {
              if (catcherr === false) {
                catcherr = true;
                console.error(e);
              }
            } finally {
              this.$frame.delete();
            }
          };

        let onloadFunc = () => {
          this.$el.removeEventListener('load', onloadFunc);
          window.setTimeout(frameFunc, 0);
          this._timerid = window.setInterval(frameFunc, this.$delay);
          if (nextTick && nextTick instanceof Function)
            window.setTimeout(nextTick, 0);
        }
        if (!isvideo) {
          this.$el.addEventListener('load', onloadFunc);
        }
      });
    }
  }
  $stop() {
    window.clearInterval(this.$timerid);
    this._timerid = undefined;
    this.$capture.delete();
    this.$frame.delete();
    let destructor = function (o) {
      if (o.delete instanceof Function) o.delete();
      else if (o instanceof Object)
        for (let key in o) {
          if (o[key] !== undefined) destructor(o[key]);
        }
    };
    window.setTimeout(destructor, 0, this._cvDataObj);
  }
}

export default TrackerVideo;
