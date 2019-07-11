<template>
  <div class='RovSlider'>
    <vue-slider class="slider" v-bind="sliderStyle" :value="slider.value" :min="slider.min" :max="slider.max" @input="$emit('input',arguments[0])" />
    <div class="slider-label">
      <h5 class="slider-value">{{ slider.value }}</h5>
      <h5 class="slider-name">{{ slider.name }}</h5>
    </div>
  </div>
</template>

<script>
import vueSlider from "vue-slider-component";
export default {
  name: "",
  components: {
    vueSlider
  },
  props: ["slider"],
  data() {
    return {
      sliderStyle: {
        direction: "vertical",
        tooltip: false,
        width: 4,
        min: 100,
        max: 200
      }
    };
  },
  methods: {}
};
</script>

<style lang='scss'>
.RovSlider {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  margin: 5px;
  > .slider {
    flex-grow: 2;
  }
  .slider-label {
    text-align: center;
    background: #3498db;
    border-radius: 3px;
    color: white;
    padding: 5px;
    margin-top: 5px;
    > * {
      font-weight: normal;
      margin-top: 3px;
      margin-bottom: 3px;
    }
    > .slider-name {
      white-space: nowrap;
    }
    > .slider-value {
      width: 32px;
      max-width: 32px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>