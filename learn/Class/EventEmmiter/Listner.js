class Listner {
  constructor(callback, once = false) {
    this.callback = callback;
    this.once = once;
  }
}

export default Listner;
