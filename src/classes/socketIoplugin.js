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


  const websocket = new WebSocket('ws://192.168.1.76:5001');
  Vue.prototype.$websocket = websocket;
  websocket.onopen = () => {
	console.log('connect');
	setTimeout(() => {
		Vue.prototype.$websocket.go(new mavlink.messages.request_data_stream(1, 1, mavlink.MAV_DATA_STREAM_ALL, 5, 1));
	}, 1000);	
	let timer = setInterval(() => {
		Vue.prototype.$websocket.go({ type: 'heatbeat', args: [mavlink.MAV_TYPE_GCS, mavlink.MAV_AUTOPILOT_INVALID, 0, 0, 0]});
	},1000);
	setTimeout(() => {
		Vue.prototype.$socket.on('mavMessage', (message) => {
			let msg = Vue.prototype.$mavlink.parseBuffer(Buffer.from(message));
		});		
	}, 1000);
  }
  websocket.onclose = () => {
	cleatInterval(timer);	
  }

  function go(args) {
	if(args.type) {
		console.log(1);
		Vue.prototype.$websocket.send(Buffer.from(JSON.stringify(args)));
	}else {
		console.log(2);
		let message = new Buffer(args.pack(mavlink.MAVLink));
		Vue.prototype.$websocket.send(message);
	}
  }
  Vue.prototype.$websocket.go = go;
}

export default {
  install
}
