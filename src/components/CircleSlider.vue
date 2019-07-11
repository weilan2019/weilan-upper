<!-- CircleSlider -->
<template>
  <div class="CircleSlider">
    <svg ref="svg" viewBox="0 0 120 120">
      <path stroke="#00be7e" fill="none" stroke-width="2" :d="cpathd"></path>
      <circle fill="#00be7e" r="7" :cx="bpoint.x" :cy="bpoint.y" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseout="onMouseOut" @touchmove="onTouchMove" @touchstart="onTouchStart" @touchend="onTouchEnd" @click="onClick"></circle>
    </svg>
    <transition name="fade">
      <div class="tag" v-if="tagshow" :style="tagStyle">
        {{name}}:{{Math.round(value * 100)}}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    name: String
  },
  data() {
    return {
      tagshow: false,
      tagStyle: {
        left: null,
        top: null
      }
    };
  },
  computed: {
    cpathd() {
      let { x, y, angle } = this.bpoint;
      let large = angle > 0.5 * Math.PI ? 1 : 0;
      return `M60 110 A 50 50 0 ${large} 0 ${x} ${y}`;
    },
    bpoint() {
      let angle = this.value * 2 * Math.PI - 0.5 * Math.PI;
      let x = 60 + Math.cos(angle) * 50;
      let y = 60 - Math.sin(angle) * 50;
      if (x > 59.9 && y > 109.9) {
        x = 58.078343894939756;
        y = 109.96305873156571;
      }
      return { x, y, angle };
    }
  },
  components: {},

  methods: {
    onMouseDown({ offsetX, offsetY, clientX, clientY }) {
      let { clientWidth, clientHeight } = this.$refs.svg;
      this.centerP = {
        x: clientX - offsetX + clientWidth / 2,
        y: clientY - offsetY + clientHeight / 2
      };
      window.addEventListener("mousemove", this.onBaseMove);
      window.addEventListener("mouseup", this.onMouseUp);
      this.tagshow = false;
    },
    onMouseUp() {
      window.removeEventListener("mousemove", this.onBaseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
    },
    onMouseMove(e) {
      if (e.buttons == 0) {
        this.tagshow = true;
        this.tagStyle = {
          left: e.offsetX + "px",
          top: e.offsetY - 30 + "px"
        };
      }
    },
    onMouseOut(e) {
      this.tagshow = false;
    },
    onClick() {
      this.tagshow = true;
    },
    onBaseMove({ clientX, clientY }) {
      let abx = clientX - this.centerP.x;
      let aby = -(clientY - this.centerP.y);
      if (abx == 0) return this.$emit("input", aby > 0 ? 0.5 : 0);
      if (this.lastX * abx < 0 && aby < 0)
        return this.$emit("input", this.value < 0.5 ? 0 : 1);
      this.lastX = abx;
      let zangle = 0.75 + Math.atan(aby / abx) / Math.PI / 2;
      if (abx > 0) zangle -= 0.5;
      this.$emit("input", zangle);
    },
    onTouchMove({ touches: [touch] }) {
      this.onBaseMove(touch);
    },
    onTouchStart({ touches: [touch], path }) {
      let size = path[2].clientHeight / 2;
      // console.log(size);

      let angle = this.value * 2 * Math.PI;

      this.centerP = {
        x: touch.clientX - Math.sin(angle) * size,
        y: touch.clientY - Math.cos(angle) * size
      };
    },
    onTouchEnd({ touches: [touch] }) {
      this.onMouseUp(touch);
      this.tagshow = false;
    }
  }
};
</script>
<style lang='scss'>
.CircleSlider {
  position: relative;
  > svg {
    position: absolute;
    left: -10%;
    top: -10%;
    height: 120%;
    width: 120%;
  }
  > .tag {
    position: absolute;
    color: white;
    font-size: 0.7rem;
    padding: 3px 7px;
    border-radius: 3px;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    z-index: 100000;
  }
}
</style>