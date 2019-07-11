<template>
    <div id='TextPanel'>
        <div class="line">
            <span>内温:</span>
            <span>{{intemp}}°</span>
        </div>
        <div class="line">
            <span>外温:</span>
            <span>{{outtemp}}°</span>
        </div>
        <div class="line">
            <span>震动:</span>
            <span>{{vibration}}</span>
        </div>
        <div class="line">
            <span>压强:</span>
            <span>{{pressure}} mbar</span>
        </div>
        <div class="line">
            <span>深度:</span>
            <span>{{depth}} m</span>
        </div>
    </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      intemp: "UnKnown",
      outtemp: "UnKnown",
      vibration: "UnKnown",
      pressure: "UnKnown",
      depth: "UnKnown"
    };
  },
  methods: {
    onTemp(temp) {
      this.intemp = (Number(temp.slice(2)) / 1000).toFixed(2);
    },
    onVibration(e) {
      this.vibration = `${e.vibration_x.toFixed(1)},${e.vibration_y.toFixed(
        1
      )},${e.vibration_z.toFixed(1)}`;
    },
    onScaledPressure(e) {
      this.pressure = e.press_abs.toFixed(2);
      this.outtemp = e.temperature / 100;
    }
  },
  mounted() {
    this.$socket.on("temp", this.onTemp);
    this.$mavlink.on("VIBRATION", this.onVibration);
    this.$mavlink.on("SCALED_PRESSURE2", this.onScaledPressure);
  },
  beforeDestroy() {
    this.$socket.removeListener("temp", this.onTemp);
    this.$mavlink.removeListener("VIBRATION", this.onVibration);
    this.$mavlink.removeListener("SCALED_PRESSURE2", this.onScaledPressure);
  }
};
</script>

<style lang='scss'>
#TextPanel {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background:rgba(0, 0, 0, 0.5);
  box-shadow:5px 5px 10px rgba(0,0,0,0.8);
  border-radius: 10px;
  padding:5% 5%;
  width: 80%;
  > .line {
    font-size: 14px;
    font-weight: lighter;
    display: flex;
  }
  @media (max-width: 900px) {
    position: fixed;
    right: 7px;
    bottom: 7px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    padding: 7px;
    z-index: 1;
    width: 100px;
    > .line {
      font-size: 10px !important;
    }
  }
}
</style>