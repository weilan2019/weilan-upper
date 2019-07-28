<!-- MavLinkCtrl -->
<template>
  <div id='MavLinkCtrl' :class="{joystick}">
    <div class="inner">
      <JoyStickSingle name="x平面" :size="100" :axis="laxis" ref="ljoy" />
      <div class="armbutton">
        <div class="circ" :class="{armed}" @click="armed = !armed">
          {{ armed ? "arming" : "disarmed" }}
        </div>
      </div>
      <div class="mode">
        <div class="modeinner">
          {{mode}}
        </div>
        <div v-if="joystick" class="joyStickBinding">
          JoyStick Binding
        </div>
      </div>
      <JoyStickSingle name="深度与偏航" :size="100" slidername="云台" :slidervalue="cloudServo" @slidervalue="cloudServo=arguments[0]" :axis="raxis" ref="rjoy" />
    </div>
  </div>
</template>

<script>
import JoyStickSingle from "./JoyStickSingle";
import { createWatchList, JoyStickFilter } from "@/classes/util";
import mavlink from '../assets/mavlink.js';
const watch = createWatchList(
  {
    rov: {
      up: ["raxis", "", { y: 1 }, JoyStickFilter],
      down: ["raxis", "", { y: -1 }, JoyStickFilter],
      tleft: ["raxis", "", { x: 1 }, JoyStickFilter],
      tright: ["raxis", "", { x: -1 }, JoyStickFilter],
      front: ["laxis", "", { y: 1 }, JoyStickFilter],
      back: ["laxis", "", { y: -1 }, JoyStickFilter],
      left: ["laxis", "", { x: 1 }, JoyStickFilter],
      right: ["laxis", "", { x: -1 }, JoyStickFilter]
    }
  },
  { x: 0, y: 0 }
);

export default {
  name: "",
  components: {
    JoyStickSingle
  },
  data() {
    return {
      cloudServo: 0.5,
      armed: false,
      laxis: {
        x: 0,
        y: 0
      },
      raxis: {
        x: 0,
        y: 0
      },
      joystick: false,
      mode: "MANUAL"
    };
  },
  watch: {
    cloudServo(val) {
      val = val * 0.0175 + 0.1085;
      console.log(val);
      this.$socket.emit("tilt", val);
    },
    armed(val) {
      if (this.myarm !== -1) {
		  console.log(mavlink.messages);
		  console.log(mavlink.messages.command_long);
		this.$websocket.go(
				new mavlink.messages.command_long(
					this.$mavlink.targt_system, 
					this.$mavlink.target_component, 
					this.$mavlink.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 
					0, 
					val ? 1 : 0,
					0,
					0,
					0,
					0,
					0,
					0));
        this.myarm = 1;
      }

      if (val) {
        this.onHandleAxis();
      } else this.unHandleAxis();
      if (this.myarm === -1) delete this.myarm;
    },
    ...watch
  },
  methods: {
    onHandleAxis() {
      let {
        ljoy: { axis: laxis },
        rjoy: { axis: raxis }
      } = this.$refs;
      this.handTimerId = setInterval(() => {
        let cmd ={
			type: 'manual_control', 
			args: [
			this.$mavlink.target_system, 
			Math.round(laxis.y * 1000),
            Math.round(laxis.x * 1000),
            Math.round(raxis.y * 500 + 500),
            Math.round(raxis.x * 1000),
            this.btngroup
			]
		}
        console.log(cmd);
        this.$websocket.go(cmd);
      }, 50);
    },
    unHandleAxis() {
      clearInterval(this.handTimerId);
    },
    onGamePadConnect() {
      this.joystick = true;
    },
    onGamePadUpdate(gamepad) {
      this.laxis.x = -gamepad.axes[0];
      this.laxis.y = -gamepad.axes[1];
      this.raxis.x = -gamepad.axes[2];
      this.raxis.y = -gamepad.axes[3];
      let btngroup = 0;
      [0, 0, 12, 11, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 2].forEach(
        (offset, index) => {
          if (offset == 0) return;
          btngroup += gamepad.buttons[index].value << offset;
        }
      );
      this.btngroup = btngroup;
      // console.log(Math.log2(btngroup));
    },
    onCommandAck(mes) {
      console.log(mes);
      if (mes.command == this.$mavlink.mavlink.MAV_CMD_COMPONENT_ARM_DISARM) {
        if (this.myarm == 1) delete this.myarm;
        else {
          if (this.armed) this.myarm = -1;
          this.armed = false;
        }
        return;
      }
      if (mes.command == this.$mavlink.mavlink.MAVLINK_MSG_ID_SET_MODE) {
        console.log(mes.result);
      }
    },
    onDisConnect() {
      this.joystick = false;
    }
  },
  mounted() {
    this.btngroup = 0;
    this.$gamepad.on("connect", this.onGamePadConnect);
    this.$gamepad.on("update", this.onGamePadUpdate);
    this.$gamepad.on("disconnect", this.onDisConnect);
    this.$mavlink.on("COMMAND_ACK", this.onCommandAck);
  },
  beforeDestroy() {
    this.$gamepad.removeListener("connect", this.onGamePadConnect);
    this.$gamepad.removeListener("update", this.onGamePadUpdate);
    this.$mavlink.removeListener("disconnect", this.onDisConnect);
    this.$mavlink.removeListener("COMMAND_ACK", this.onCommandAck);
  }
};
</script>

<style lang='scss'>
#MavLinkCtrl {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  &.joystick .JoyStickSingle * {
    transition: none;
  }
  .mode {
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .modeinner {
      background: rgb(0, 190, 126);
      color: white;
      font-weight: lighter;
      font-size: 0.7rem;
      border-radius: 3px;
      padding: 3px 6px;
    }
    .joyStickBinding {
      color: white;
      border-radius: 30px;
      z-index: 10000;
      padding: 10px;
      background: rgba(0, 0, 0, 0.8);
    }
  }
  > .inner {
    min-width: 250px;
    $radius: 70px;
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    padding: 20px;
    //background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    > .armbutton {
      align-self: flex-end;
      margin-bottom: 1rem;
      .circ {
        &.armed {
          background: #2ac88f;
        }
        background: #fc5857;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(0.3);
        margin: 10px;
        transition: all ease-in-out 0.4s;
        font-size: 0.2rem;
        &:hover {
          transform: scale(1.1);
          margin: 20px;
        }
      }
    }
  }
  @media (max-width: 900px) {
    > .inner {
      width: 60%;
    }
    .circ {
      transform: scale(1.1) !important;
      margin: 0px !important;
      margin-bottom: -20px !important;
    }
  }
}
</style>
