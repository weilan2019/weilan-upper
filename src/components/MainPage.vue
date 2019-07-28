<template>
  <div id='MainPage'>
    <div class="outputdiv">
      <canvas ref="canvas" width="1000" height="800" :style="canvasStyle"></canvas>
    </div>
    <div class="source" ref="source" :style="{'background-image':`url(${$store.state.viewbox[4] ? $store.getters.videoStream : ''})`}"></div>
    <!-- <div class="source" ref="source"></div> -->
    <div class="leftPanel">
        <transition name="fade">
          <JudgeDepth v-if="$store.state.viewbox[5]"/>
        </transition>
    </div>
    <div class="rightPanel">
      <transition name="fade">
        <ControlPanel v-if="$store.state.viewbox[0]" name="概览">
          <SensorPanel />
        </ControlPanel>
      </transition>
      <transition name="fade">
        <ControlPanel v-if="$store.state.viewbox[1]" name="机械臂/履带控制">
          <PwmPanel />
        </ControlPanel>
      </transition>
      <transition name="fade">
        <ControlPanel v-if="$store.state.viewbox[2]">
          <TextPanel />
        </ControlPanel>
      </transition>
    </div>
    <transition name="fadeUp">
      <MavLinkCtrl v-show="$store.state.viewbox[3]" />
    </transition>  
  </div>
</template>

<script>
import TrackerVideo from "@/classes/TrackerVideo";
import ControlPanel from "./ControlPanel";
import { DispatchHTMLEvent } from "@/classes/util";
import MavLinkCtrl from "./MavLinkCtrl";
import JudgeDepth from "./JudgeDepth";
import PwmPanel from "./PwmPanel";
import SensorPanel from "./SensorPanel";
import TextPanel from "./TextPanel";
export default {
  name: "",
  components: {
    ControlPanel,
    PwmPanel,
    MavLinkCtrl,
    JudgeDepth,
    SensorPanel,
    TextPanel
  },
  data() {
    return {
      canvasStyle: {}
    };
  },
  methods: {},
  mounted() {
    //disable select
    document.onselectstart = function() {
      return false;
    };

    //opencv init
    // const canvas = this.$refs.canvas;
    // const app = document.getElementById("app");

    // const rsEvent = () => {
    //   var hscale = app.clientWidth / canvas.width;
    //   var vscale = app.clientHeight / canvas.height;
    //   this.canvasStyle = {
    //     transform: `scale(${Math.max(hscale, vscale)})`
    //   };
    // };
    // window.addEventListener("resize", rsEvent);

    // // setTimeout(rsEvent, 200);
    // new TrackerVideo({
    //   FPS: 0,
    //   inputElement: this.$refs.source,
    //   outputElement: canvas,
    //   init:
    //     window.VideoInitFunc ||
    //     async function() {
    //       return function(frame) {
    //         cv.cvtColor(frame, frame, cv.COLOR_RGB2GRAY, 0);
    //         return frame;
    //       };
    //     },
    //   nextTick() {
    //     DispatchHTMLEvent("resize", window);
    //   }
    // });
  }
};
</script>

<style lang='scss'>
#MainPage {
  height:100%;
  background:rgba(0,0,0,0.2);
  .outputdiv {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    //background-image: url(/static/HXbackground.png);
    background-size: cover;
    background-position: center;
  }
  .rightPanel {
    position: fixed;
    display: flex;
    flex-direction: column;
    right: 30px;
    width: 320px;
    top: 100px;
    > * {
      min-height: 180px;
    }
  }
  .leftPanel{
    position: fixed;
    display: flex;
    flex-direction: column;
    left: 30px;
    width: 320px;
    top: 100px;
  }
  .source {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>