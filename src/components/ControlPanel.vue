<template>
  <div class='ControlPanel'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss'>
.ControlPanel {
  // position: fixed;
  //box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  $radius: 5px;
  border-radius: $radius;
  opacity: 1;
  //background: rgba(0, 0, 0, 0.5);
  transition: all ease-in-out 0.4s;
  margin-bottom: 15px;
  @media (max-width: 900px) {
    background: transparent;
    box-shadow: none;
  }
}
</style>