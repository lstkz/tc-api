import logger from './logger';

export default class Timer {
  constructor({ fn, name, timeout }) {
    this._fn = fn;
    this._name = name;
    this._timeout = timeout;
    this._isRunning = false;
    this._isStopped = true;
  }

  schedule() {
    this._timerId = setTimeout(() => this.start(), this._timeout);
  }

  start(force = true) {
    if (!force && this._isStopped) {
      return;
    }
    this._isStopped = false;
    if (this._isRunning) {
      return;
    }
    clearTimeout(this._timerId);
    this._isRunning = true;
    this._fn()
      .catch((e) => {
        logger.error(e, `Job: ${this._name}`);
      })
      .finally(() => {
        this._isRunning = false;
        this._timerId = setTimeout(() => this.start(false), this._timeout);
      });
  }

  stop() {
    clearTimeout(this._timerId);
    this._isStopped = true;
  }
}
