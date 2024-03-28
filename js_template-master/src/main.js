import SubMain from "./subMain.js";
export default class Main {
  constructor() {
    new SubMain();
  }
}
window.onload = function () {
  new Main();
};
