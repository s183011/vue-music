<template>
    <div class="tab-wrapper">
        <router-link tag="div" to="/recommend" class="tab-link">
            推荐
        </router-link>
        <router-link tag="div" to="/singer" class="tab-link">
            歌手
        </router-link>
        <router-link tag="div" to="/rank" class="tab-link">
            排行
        </router-link>
        <router-link tag="div" to="/search" class="tab-link">
            搜索
        </router-link>
    </div>
</template>
<script>
export default {
    name:'Tab' 
}
</script>
<style lang="stylus" scoped>
    .tab-wrapper
        display flex
        height 44px
        line-height 44px
        .tab-link
            width 25%
            color $color-text
            text-align center
            font-size $font-size-medium
        .router-link-active
            border-bottom 2px solid $color-text
</style>


