<!-- SensorPanel -->
<template>
  <div id="SensorPanel">
    <div class="instrumentsWrap">
      <div class="accelroll">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1779">
          <!-- <path :style="`transform:rotate(${north}deg)`" d="M497.1439304791101 606.4796094132988L255.5892317483415 778.6976601236245 497.15641444933203 127.35263663629752 716.7515953065143 778.6976608307314z"></path> -->
          <path class="absline" stroke="#999999" stroke-width="20" d="M12 512 L1000 512" />
          <path class="absline" stroke="#999999" stroke-width="20" d="M512 12 L512 1000" />
          <path class="rollbg" stroke="rgba(255,255,255,0.5)" stroke-width="15" fill="none" d="M512 200 A312 312 0 1 1 200 512"></path>
          <path class="rollbg rev" stroke="rgba(255,255,255,0.5)" stroke-width="15" fill="none" d="M512 12 A494 494 0 1 1 12 512"></path>
          <path class="pitchpath" fill="#fc5858" :style="{transform:`rotate(${-att.pitch}deg)`}" d="M512 480 A44 44 0 0 0 512 544 L1000 512 Z"></path>
          <path class="rollpath" fill="rgba(0,193,222,0.81)" :style="{transform:`rotate(${att.roll}deg)`}" d="M512 412 L612 512 L950 512 A 350 350 0 0 1 880 672 A 750 750 0 0 0 144 672 A 350 350 0 0 1 74 512 L412 512 Z"></path>
        </svg>
        <div class="rolltext">
          <div class="line">
            <span>翻滚角:</span>
            <span>{{ att.roll }}°</span>
          </div>
          <div class="line">
            <span>俯仰角:</span>
            <span>{{ att.pitch }}°</span>
          </div>
        </div>
      </div>
    </div>
    <div class="instrumentsWrap">
      <div class="compass">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1779">
          <path v-for="rot in 6" :style="{transform:`rotate(${rot*30}deg)`}" :key="rot" stroke-dasharray="15,15" class="absline" stroke="rgba(255,255,255,0.31)" stroke-width="15" fill="none" d="M512 0 L512 1024"></path>
          <circle v-for="rot in 3" :key="rot + 6" cx="512" cy="512" fill="none" :r="rot * 150" stroke-dasharray="40,40" stroke="rgba(255,255,255,0.31)" stroke-width="15"></circle>
          <g class="compasspath">
            <path :style="`transform:rotate(${north}deg)`" d="M497.1439304791101 606.4796094132988L255.5892317483415 778.6976601236245 497.15641444933203 127.35263663629752 716.7515953065143 778.6976608307314z"></path>
          </g>
        </svg>
        <h5>{{ compassDesc }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      raw: {
        xacc: 0,
        yacc: 0,
        zacc: 0,
        xgyro: 0,
        ygyro: 0,
        zgyro: 0,
        xmag: 0,
        ymag: 0,
        zmag: 0
      },
      att: {
        roll: 0,
        pitch: 0,
        yaw: 0
      },
      north: 0
    };
  },

  components: {},
  computed: {
    compassDesc() {
      let angle = this.north;
      switch (angle) {
        case 0:
          return "正北";
        case 90:
          return "正东";
        case 180:
          return "正南";
        case 270:
          return "正西";
      }
      if (angle > 0 && angle < 90) return `北偏东${angle}°`;
      if (angle > 90 && angle < 180) return `南偏东${180 - angle}°`;
      if (angle > 180 && angle < 270) return `南偏西${angle - 180}°`;
      return `北偏西${360 - angle}°`;
    }
  },

  methods: {
    HandleAttitude(dat) {
      this.att.pitch = (dat.pitch / Math.PI * 180).toFixed(0);
      let _roll = 180 - dat.roll / Math.PI * 180;
      if (_roll > 180) _roll = _roll - 360;
      this.att.roll = _roll.toFixed(0);
    },
    HandleHud(dat) {
      this.north = dat.heading;
    }
  },
  mounted() {
    this.$mavlink.on("ATTITUDE", this.HandleAttitude);
    this.$mavlink.on("VFR_HUD", this.HandleHud);

    // const namelist = {};
    // this.$mavlink.on("message", m => {
    //   if (!namelist[m.name]) {
    //     console.log(m);
    //     namelist[m.name] = m;
    //   }
    // });
    // global.namelist = namelist;
  },
  beforeDestroy() {
    this.$mavlink.removeListener("ATTITUDE", this.HandleAttitude);
    this.$mavlink.removeListener("VFR_HUD", this.HandleHud);
  }
};
</script>
<style lang='scss'>
.instrumentsWrap{
    width:140px;
    height:140px;
    display:flex;
    justify-content:center;
    align-items: center;
    background:rgba(0,0,0,0.4);
    border:1px solid rgba(0,0,0,0.5);
    //background:rgba(255,255,255,0.3);
    border-radius: 50%;
    box-shadow:0px 0px 10px rgba(0,0,0, 0.8)
  }
#SensorPanel {
  color: white;
  display: flex;
  > * + * {
    margin-left: 2rem;
  }
  .accelroll,
  .compass {
    width: 100px;
    height: 100px;
    position: relative;
  }
  .accelroll {
    .rollpath,
    .pitchpath {
      transform-origin: 50% 50%;
    }
    .rollbg {
      animation: rollanimation 30s linear;
      animation-iteration-count: infinite;
      transform-origin: center;
      &.rev {
        animation-direction: reverse;
      }
      @keyframes rollanimation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
    .rolltext {
      position: absolute;
      font-size: 0.7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3px;
      border-radius: 3px;
      //background: rgba(0, 0, 0, 0.31);
      bottom: -10%;
      left: 10%;
      right: 10%;
      .line {
        display: flex;
        align-self: stretch;
        margin: 0 5px;
        white-space: nowrap;
        > span {
          &:nth-child(1) {
            flex-basis: 80%;
          }
          &:nth-child(2) {
            flex-basis: 20%;
          }
        }
      }
    }
  }
  .compass {
    border-radius: 50%;
    background: #08be7d;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    position: relative;
    > svg {
      path {
        transform-origin: 50% 50%;
      }
      .compasspath {
        transform: scale(0.6);
        transform-origin: center;
      }
    }
    > h5 {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin-bottom: 0.7rem;
      font-size: 0.7rem;
      text-align: center;
      font-weight: lighter;
    }
  }
  @media (max-width: 900px) {
    $panpad: 3%;
    $panbottom: 5%;
    .accelroll,
    .compass {
      position: fixed;
      transform: scale(0.8);
    }
    .accelroll {
      left: $panpad;
      bottom: $panbottom;
    }
    .compass {
      right: $panpad;
      bottom: $panbottom + 15%;
    }
  }
}
</style>