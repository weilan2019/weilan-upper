<!-- JoyStickSingle -->
<template>
  <div class="JoyStickSingle">
    <div class="instrumentsWrap">
      <div class="bg" :style="bgStyle">
        <CircleSlider v-if="slidername" @input="$emit('slidervalue',arguments[0])" :value="slidervalue" :name="slidername" />
        <div ref="bar" class="bar" :class="{downed}" :style="barStyle" @mousedown="onMouseDown" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onMouseUp" @click="onClick"></div>
      </div>
    </div>
    <div v-once v-if="name" class="name">{{name}}</div>
  </div>
</template>

<script>
import CircleSlider from "./CircleSlider";
export default {
  props: {
    slidername: null,
    slidervalue: null,
    size: Number,
    name: String,
    axis: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    }
  },
  data() {
    return {
      barOffset: {
        x: 0,
        y: 0
      },
      downed: false
    };
  },
  components: {
    CircleSlider
  },
  computed: {
    barStyle() {
      let x = -this.axis.x * this.size / 2;
      let y = -this.axis.y * this.size / 2;
      let style = {
        transform: `translate(${x}px,${y}px)`
      };
      // if (x != 0 && y != 0) {
      //   style.transition = "none";
      // }
      return style;
    },
    bgStyle() {
      return {
        width: this.size + "px",
        height: this.size + "px"
      };
    }
  },
  methods: {
    onClick(e) {
      if (!this.unclicked === true) {
        this.$emit("click", e);
      }
    },
    onMouseDown({ clientX, clientY }) {
      this.barStart = {
        x: clientX,
        y: clientY
      };
      this.downed = true;
      this.$emit("active", this.axis);
      window.addEventListener("mousemove", this.onBaseMove);
      window.addEventListener("mouseup", this.onMouseUp);
    },
    onMouseUp() {
      this.barOffset.x = 0;
      this.barOffset.y = 0;
      // this.onBaseMove({ clientX: this.barStart.x, clientY: this.barStart.y });
      this.axis.x = 0;
      this.axis.y = 0;
      this.$emit("unactive");
      this.downed = false;
      setTimeout(() => (this.unclicked = false), 0);
      window.removeEventListener("mousemove", this.onBaseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
    },
    onTouchStart({ touches }) {
      let touch;
      for (let t in touches)
        if (touches[t].target === this.$refs.bar) touch = touches[t];
      this.onMouseDown(touch);
    },
    onTouchMove({ touches }) {
      // console.log(arguments[0].touches);
      let touch;
      for (let t in touches)
        if (touches[t].target === this.$refs.bar) touch = touches[t];
      this.onBaseMove(touch);
    },
    onBaseMove({ clientX, clientY, movementX }) {
      let x = clientX - this.barStart.x;
      let y = clientY - this.barStart.y;
      let abx, aby;
      let angle = Math.atan(x / y);
      if (y < 0) angle += Math.PI;

      if (x * x + y * y < this.size * this.size / 4) {
        abx = x / this.size * 2;
        aby = y / this.size * 2;
      } else {
        abx = Math.sin(angle);
        aby = Math.cos(angle);
      }

      if (abx < 0.1 && abx > -0.1) abx = 0;
      if (aby < 0.1 && aby > -0.1) aby = 0;

      this.axis.x = -abx;
      this.axis.y = -aby;
      this.axis.angle = angle;
      if (movementX !== undefined) this.unclicked = true;
      this.$emit("axis", this.axis);
    }
  }
};
</script>
<style lang='scss'>
.JoyStickSingle {
  //flex-grow: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .instrumentsWrap{
    > .bg {
      position: relative;
      border-radius: 50%;
      background: rgba(0,0,0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      &:active > .mask {
        // background: red;
        z-index: 10000;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      > .CircleSlider {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
      }
      > .bar {
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background: rgba(255,255,255, 0.8);
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
        transition: all ease-in-out 0.2s;
        z-index: 20;
        &.downed {
          background: gray;
          transition: none;
        }
      }
    }
  }
  .name {
    color: white;
    padding: 3px 10px;
    min-width: 60px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.7);
    font-size: 0.9rem;
    text-align: center;
    box-shadow: 0px 3px 5px rgba(0,0,0,0.8);
    margin-top: 15px;
  }
  @media (min-width: 660px) and (max-width: 900px) {
    transform: scale(1.2);
  }
}
</style>