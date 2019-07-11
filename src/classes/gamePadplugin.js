import events from "events"

function install(Vue) {

  let emitter = new events();
  Vue.prototype.$gamepad = emitter;

  window.addEventListener('gamepadconnected', function (e) {
    console.log(e);
    let gameid;
    let gamepads = navigator.getGamepads()

    for (let i in gamepads) {
      if (gamepads[i] !== null) {
        gameid = i;
        break;
      }
    }

    emitter.canceled = false;
    emitter.emit("connect", e);

    function frameEvent() {
      if (emitter.canceled) return;
      let gamepads = navigator.getGamepads()[gameid];
      emitter.emit('update', gamepads);
      requestAnimationFrame(frameEvent);
    }
    requestAnimationFrame(frameEvent);

  });

  window.addEventListener('gamepaddisconnected', function (e) {
    emitter.emit('disconnect', e);
    emitter.canceled = true;
  })
}


export default {
  install
}
