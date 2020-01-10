<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Tab from 'components/tab/Tab'
import MHeader from 'components/m-header/Header'
import Player from 'components/player/Player'
export default {
  name: 'app',
  components: {
    Tab,
    MHeader,
    Player
  }
}
</script>

<style lang="stylus">
  #app{
    background $color-theme
  }
</style>
