const keyBind = {};

document.addEventListener('keydown', function (e) {
  let list = keyBind[e.keyCode];
  if (list && !list.pressing) {
    list.down();
    list.pressing = true;
  }
})

document.addEventListener('keyup', function (e) {
  let list = keyBind[e.keyCode];
  if (list) {
    list.up();
    list.pressing = false;
  }
})

export function BindKey(newkey, oldkey, ondown, onup) {
  if (oldkey !== undefined) {
    delete keyBind[oldkey];
  }
  if (newkey !== undefined)
    keyBind[newkey] = {
      down: ondown,
      up: onup
    }
}
