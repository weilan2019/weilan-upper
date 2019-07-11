<template>
  <div id="app">
    <router-view style="margin-top: 50px;" />
    <Navigator />
    <img ref="bgimg" src="@/assets/default.jpg" style="display:none">
  </div>
</template>

<script>
import("@/assets/animate.min.css");
import Navigator from "@/components/Navigator";
import KeyPress from "@/classes/KeyPress";
import { preWatcher } from "@/classes/util";
export default {
  name: "App",
  components: {
    Navigator
  },
  mounted: function() {
    preWatcher.call(this);
    this.$el.style.backgroundImage = `url(${this.$refs.bgimg.src})`;
  }
};
</script>

<style lang="scss">
#app {
  font-family: Microsoft YaHei;
  transition: all ease-in-out 0.4s;
  /* background-image: url(/video_feed); */
  /* background-size: cover; */
  /* background-position: center; */
  /* background-repeat: no-repeat; */
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;  
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
body {
  margin: 0;
  height: 100%;
}
.msinput {
  background: rgba(238, 238, 238, 0.5);
  border: 0;
  color: white;
  &:focus {
    outline: none;
  }
}
.fade-enter-active {
  animation-duration: 0.4s;
  animation-name: fadeIn;
}
.fade-leave-active {
  animation-duration: 0.4s;
  animation-name: fadeOut;
}
.icon {
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
.fadeDown-enter-active {
  animation: fadeInDown;
  animation-duration: 0.4s;
}
.fadeDown-leave-active {
  animation: fadeOutUp;
  animation-duration: 0.4s;
}
.fadeUp-enter-active {
  animation: fadeInUp;
  animation-duration: 0.4s;
}
.fadeUp-leave-active {
  animation: fadeOutDown;
  animation-duration: 0.4s;
}
</style>
