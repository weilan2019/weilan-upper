/**
 * Dispatch element event on HTMLElement such as 'resize'
 *
 * @export
 * @param {string} type
 * @param {HTMLElement} element
 */
export function DispatchHTMLEvent(type, element = window) {
  let e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  element.dispatchEvent(e);
}


import {
  BindKey
} from "@/classes/KeyPress";
const prefix = "$store.state.keyBoard"
export function createWatchList(list, startState) {
  const result = {},
    stateDic = {};
  Object.keys(list).forEach(key1 => {
    let list1 = list[key1];
    Object.keys(list1).forEach(key2 => {
      const [key, handler, change, filter] = list1[key2];
      stateDic[key] = stateDic[key] || Object.create(startState);
      const state = stateDic[key];

      let changeKeys = Object.keys(change);
      result[`${prefix}.${key1}.${key2}`] = function (val, oval) {
        let bindkey = this[key];
        this[`_${key}_handnum`] = 0;
        BindKey(val, oval, () => {
          if (this[`_${key}_handnum`] == 0) {
            let hName = `on${handler}`;
            this[hName] && this[hName]()
          }
          if (filter) {
            changeKeys.forEach(changekey => {
              state[changekey] += change[changekey];
              filter(bindkey, state);
            })
          } else {
            changeKeys.forEach(changekey => {
              bindkey[changekey] += change[changekey];
            })
          }
          this[`_${key}_handnum`]++;
          // console.log(this[`_${key}_handnum`]);
        }, () => {
          this[`_${key}_handnum`]--;
          if (this[`_${key}_handnum`] == 0) {
            let hName = `un${handler}`;
            this[hName] && this[hName]()
          }
          if (filter) {
            changeKeys.forEach(changekey => {
              state[changekey] -= change[changekey];
              filter(bindkey, state);
            });
          } else {
            changeKeys.forEach(changekey => {
              bindkey[changekey] -= change[changekey];
            })
          }
          // console.log(this[`_${key}_handnum`]);
        });
      }
    });
  });
  return result;
}

export function JoyStickFilter(ob, state) {
  if (state.x ** 2 + state.y ** 2 > 1) {
    let angle = Math.atan(state.y / state.x);
    if (state.x < 0) angle += Math.PI;
    ob.x = Math.cos(angle);
    ob.y = Math.sin(angle);
  } else {
    ob.x = state.x;
    ob.y = state.y;
  }
}

export function debounce(callback, timeout) {
  let timerid;
  return function (...args) {
    if (timerid !== undefined) {
      clearTimeout(timerid);
      timerid = undefined;
    }
    timerid = setTimeout(callback, timeout, ...args);
  }
}

export function preWatcher() {

  this.$watch('$store.getters.commandStream', debounce(n => {
    if (/^wss?:\/\//.test(n)) {
      this.$socket.connect(n, {
        transports: ['websocket']
      });
    } else {
      this.$socket.connect(n);
    }
  }, 300));

  this.$socket.on('connect', () => {
    this.$store.commit('connectState', this.$store._connectStateEnum.success);
  });

  this.$socket.on('connect_error', () => {
    this.$store.commit('connectState', this.$store._connectStateEnum.failed);
  });

  this.$socket.on('connect_timeout', () => {
    this.$store.commit('connectState', this.$store._connectStateEnum.timeout);
  });

  this.$socket.on('reconnecting', () => {
    this.$store.commit('connectState', this.$store._connectStateEnum.ing);
  });

}
