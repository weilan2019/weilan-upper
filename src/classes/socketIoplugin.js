import io from "socket.io-client";
import mavlink from "../assets/mavlink"

function install(Vue) {

  function connect(...args) {
    let _socket = Vue.prototype.$socket;
    if (_socket.connected || _socket.disconnected) {
      _socket.close();
    }
    let socket = io(...args)
    socket.connect = connect;

    socket._callbacks = _socket._callbacks;
    socket.emit('reconnecting');
    Vue.prototype.$socket = socket;
  }

  const $mavlink = new mavlink.MAVLink(null, 1, 50);
  $mavlink.target_system = 1;
  $mavlink.target_component = 1;
  $mavlink.mavlink = mavlink;
  Vue.prototype.$mavlink = $mavlink;

  Vue.prototype.$socket = {
    _callbacks: {
      $mavlink: [function (buffer) {
        $mavlink.parseBuffer(buffer);
      }]
    }
  };

  connect();

  setTimeout(() => {
    Vue.prototype.$socket.emit('mavlink', {
      type: "request_data_stream",
      args: [
        $mavlink.target_system,
        $mavlink.target_component,
        mavlink.MAV_DATA_STREAM_ALL,
        5,
        1
      ]
    });

    setInterval(() => {
      Vue.prototype.$socket.emit('mavlink', {
        type: "heartbeat",
        args: [
          mavlink.MAV_TYPE_GCS,
          mavlink.MAV_AUTOPILOT_INVALID,
          0,
          0,
          0
        ]
      });
    }, 1000);
  }, 1000);
}

export default {
  install
}
