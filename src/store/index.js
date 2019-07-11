import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

const connectStateEnum = {
  default: "未连接",
  ing: "连接中",
  success: "正在通讯",
  failed: "连接出错！",
  timeout: "连接超时！"
};

const store = new Vuex.Store({
  state: {
    servo: [{
      range: [0, 0],
      middle: 0
    }, {
      range: [0, 0],
      middle: 0
    }, {
      range: [0, 0],
      middle: 0
    }],
    slider: {
      armstep: 0,
    },
    stream: {
      video: "",
      mavlink: "",
      command: ""
    },
    keyBoard: {},
    viewbox: [true, true, true, true, true],
    _windowSize: {
      width: 0,
      height: 0
    },
    _connectState: connectStateEnum.default
  },
  mutations: {
    armstep(state, val) {
      state.slider.armstep = val
    },
    tankspeed(state, val) {
      state.slider.tankspeed = val;
    },
    init(state, setting) {
      Object.keys(setting).forEach(key => {
        state[key] = setting[key]
      });
    },
    windowSize(state, width, height) {
      state._windowSize.width = width;
      state._windowSize.height = height;
    },
    connectState(state, value) {
      state._connectState = value;
    }
  },
  getters: {
    videoStream(state) {
      return GenerateLocation(state.stream.video);
    },
    commandStream(state) {
      return GenerateLocation(state.stream.command);
    }
  },
  actions: {
    async refreshStore({
      commit
    }) {
      const {
        data
      } = await Vue.prototype.$axios.get('/getconfig');
      commit('init', data);
      return true;
    },
    async saveConfig({
      state
    }) {
      const {
        data
      } = await Vue.prototype.$axios.post('/saveconfig', GetStorableState());
      return data.success;
    },
    initFromStorage({
      commit
    }, letdefault) {
      let localstore;
      if (localStorage.BMGCStore && !letdefault) {
        try {
          localstore = JSON.parse(localStorage.BMGCStore);
        } catch (e) {
          console.error(e);
        }
      }
      localstore = localstore || {
        "servo": [{
          "range": [0, 20],
          "middle": 43
        }, {
          "range": [0, 20],
          "middle": 19
        }, {
          "range": [7, 9],
          "middle": 0
        }],
        "slider": {
          "armstep": 0.03
        },
        "stream": {
          "video": "${PROTOCOL}//${SERVER}:8080/?action=stream",          
          "command": "${PROTOCOL}//${SERVER}:${PORT}"
        },
        "keyBoard": {
          "hand": {
            "up": 101,
            "down": 98,
            "left": 97,
            "right": 99
          },
          "tank": {
            "up": 38,
            "down": 40,
            "left": 37,
            "right": 39
          },
          "rov": {
            "front": 87,
            "back": 83,
            "left": 65,
            "right": 68,
            "up": 73,
            "down": 75,
            "tleft": 74,
            "tright": 76
          }
        },
        "viewbox": [true, true, true, true, true]
      };
      commit("init", localstore);
      return true;
    }
  }
});

// debug for state
// global.store = store;

// export connectState
store._connectStateEnum = connectStateEnum;

// get state for localStorage or post to server
function GetStorableState() {
  let config = {};
  Object.keys(store.state).filter(k => k[0] !== "_").forEach(key => {
    config[key] = store.state[key];
  })
  return config;
}

// convert settings
function GenerateLocation(url) {
  let result = url;
  let ReplaceKeys = {
    "${PROTOCOL}": window.location.protocol,
    "${SERVER}": window.location.hostname,
    "${PORT}": window.location.port
  };
  Object.keys(ReplaceKeys).forEach(key => {
    result = result.replace(key, ReplaceKeys[key])
  });
  return result;
}


// add auto resize ( this is unused until now )
// const app = document.getElementById("app");
// window.addEventListener("resize", () => {
//   store.commit("windowSize", app.clientWidth, app.clientHeight);
// });

// auto save to localStorage
window.addEventListener("beforeunload", () => {
  localStorage.BMGCStore = JSON.stringify(GetStorableState());
});
setTimeout(function () {
  store.dispatch("initFromStorage");
}, 0);



export default store;
