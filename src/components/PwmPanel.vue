<template>
  <div id='PwmPanel'>
        <JoyStickSingle :axis="handaxis" @click="onHandTiggle" @active="onHandleHand" @unactive="unHandleHand" :size="100" slidername="基准幅度" name="机械臂" :slidervalue="$store.state.slider.armstep" @slidervalue="$store.commit('armstep',arguments[0])" />
      <div class="rsbtn">
        <svg class="icon" viewBox="0 0 1080 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1111" @click="resetHand">
          <path d="M540.444444 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" p-id="1112"></path>
          <path d="M799.971556 531.569778c-13.198222-0.284444-24.064 10.979556-24.348445 25.144889h-0.170667c-16.497778 119.182222-114.631111 211.114667-234.496 211.114666-131.413333 0-237.909333-110.136889-237.909333-245.930666S409.6 276.024889 540.956444 276.024889c62.464 0 118.897778 25.315556 161.336889 66.104889l-80.384 16.839111c-12.686222 2.389333-21.162667 15.416889-18.944 29.013333a23.324444 23.324444 0 0 0 27.761778 19.228445l131.299556-27.648a23.836444 23.836444 0 0 0 16.497777-13.710223 25.031111 25.031111 0 0 0 4.835556-20.024888L756.849778 210.488889c-2.901333-13.482667-15.416889-21.845333-27.989334-18.773333-12.629333 2.616889-20.992 15.701333-18.545777 29.297777l14.904889 75.889778a277.731556 277.731556 0 0 0-184.263112-70.200889C383.260444 226.759111 255.431111 358.912 255.431111 521.841778s127.829333 295.082667 285.525333 295.082666c146.261333 0 266.638222-113.720889 283.363556-260.266666-0.284444-14.108444-11.150222-25.372444-24.348444-25.088z" fill="#FFFFFF" p-id="1113"></path>
        </svg>
      </div>
      <JoyStickSingle :axis="tankaxis" @active="onHandleTank" @unactive="unHandleTank" :size="100" name="履带" />
  </div>
</template>

<script>
import JoyStickSingle from "./JoyStickSingle";
import { createWatchList, JoyStickFilter } from "@/classes/util";

const watch = createWatchList(
  {
    hand: {
      up: ["handaxis", "HandleHand", { y: 1 }, JoyStickFilter],
      down: ["handaxis", "HandleHand", { y: -1 }, JoyStickFilter],
      left: ["handaxis", "HandleHand", { x: 1 }, JoyStickFilter],
      right: ["handaxis", "HandleHand", { x: -1 }, JoyStickFilter]
    },
    tank: {
      up: ["tankaxis", "HandleTank", { y: 1 }, JoyStickFilter],
      down: ["tankaxis", "HandleTank", { y: -1 }, JoyStickFilter],
      left: ["tankaxis", "HandleTank", { x: 1 }, JoyStickFilter],
      right: ["tankaxis", "HandleTank", { x: -1 }, JoyStickFilter]
    }
  },
  { x: 0, y: 0 }
);
// console.log(watch);
export default {
  name: "",
  components: {
    JoyStickSingle
  },
  watch,
  data() {
    this.servoState = {
      x: this.$store.state.servo[0].middle / 100,
      y: this.$store.state.servo[1].middle / 100,
      hand: this.$store.state.servo[2].middle > 50 ? true : false
    };
    return {
      tankaxis: {
        x: 0,
        y: 0
      },
      handaxis: {
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    onHandleTank() {
      if (this.tankTimerId !== undefined) this.unHandleTank();
      this.tankTimerId = setInterval(() => {
        let { x, y } = this.tankaxis;
        let allzero = x === y && x === 0;

        let makelist = function() {
          if (y === 0) {
            if (x > 0) return [-1, 1];
            else if (x < 0) return [1, -1];
            else return [0, 0];
          } else {
            y = y > 0 ? 1 : -1;
          }

          if (x === 0) return [y, y];
          else {
            return x > 0 ? [0, y] : [y, 0];
          }
        };

        this.$socket.emit("tank", makelist());
      }, 50);
    },
    onHandTiggle() {
      let { range } = this.$store.state.servo[2];
      this.servoState.hand = !this.servoState.hand;
      this.$socket.emit(
        "servoHand",
        this.servoState.hand ? range[1] / 100 : range[0] / 100
      );
    },
    unHandleTank() {
      clearInterval(this.tankTimerId);
      delete this.tankTimerId;
      this.$socket.emit("tank", [0, 0]);
    },
    onHandleHand() {
      let step = this.$store.state.slider.armstep / 5;
      let { servo } = this.$store.state;
      let [storex, storey, storemx, storemy] = [
        (servo[0].range[1] - servo[0].range[0]) / 100,
        (servo[1].range[1] - servo[1].range[0]) / 100,
        servo[0].range[0] / 100,
        servo[1].range[0] / 100
      ];
      const caculate = function(sval, val) {
        let res = sval + val * step;
        if (res < 0) res = 0;
        else if (res > 1) res = 1;
        return res;
      };

      if (this.handTimerId !== undefined) this.unHandleHand();
      this.handTimerId = setInterval(() => {
        let { x, y } = this.handaxis;
        y = -y;
        this.servoState.x = caculate(this.servoState.x, x);
        this.servoState.y = caculate(this.servoState.y, y);

        // console.log(this.servoState);
        this.$socket.emit("servo", [
          this.servoState.x * storex + storemx,
          this.servoState.y * storey + storemy
        ]);
      }, 50);
    },
    unHandleHand() {
      clearInterval(this.handTimerId);
      delete this.handTimerId;
    },
    resetHand() {
      const getStartStep = function(servo) {
        return (
          (((servo.range[1] - servo.range[0]) * servo.middle) / 100 +
            servo.range[0]) /
          100
        );
      };

      let { servo } = this.$store.state;

      let StepList = servo.map(getStartStep);
      // console.log(StepList);
      this.servoState = {
        x: servo[0].middle / 100,
        y: servo[1].middle / 100,
        hand: StepList[2] > 0.5 ? true : false
      };
      this.$socket.emit("servo", StepList);
    }
  },
  mounted() {
    // global.debugPwm = data => {
    //   this.$socket.emit("duty", data);
    // };
  }
};
</script>

<style lang='scss'>
#PwmPanel {
  display: flex;
  align-self: stretch;
  //padding: 4%;
  flex-grow: 2;
  border-radius: 35px;
  justify-content:space-between;
  align-items:center;
  //box-shadow:0px 0px 10px rgba(255,255,255, 0.8);
  .rsbtn {
    width: 20px;
    align-self: flex-end;
    color: #fc5858;
    margin-left: -40px;
    margin-bottom: 40px;
    z-index: 100000;
  }
  @media (max-width: 900px) {
    $panpad: 5%;
    $pantop: 20%;
    > .JoyStickSingle {
      position: fixed;
      &:nth-child(1) {
        left: $panpad;
        top: $pantop;
      }
      &:nth-child(3) {
        right: $panpad;
        top: $pantop;
      }
    }
    > .rsbtn {
      margin: 0 !important;
      position: fixed;
      left: $panpad - 3%;
      top: $pantop + 20%;
      transform: scale(1.3);
    }
  }
}
</style>