<template>
    <div class="my-header">
        <div>
            <i class="iconfont logo">&#xe63e;</i>
        </div>
        <span>浪哥001</span>
    </div>
</template>
<script>
export default {
    name:'MHeader',
    data(){
        return{
            
        }
    }
}
</script>
<style lang="stylus" scoped>
    .my-header
        height 44px
        text-align center
        line-height 44px
    .my-header div
        display inline-block
        margin 6px 5px 0 0
        width 30px
        height 32px
        line-height 32px
        .logo
            font-size 30px 
            color $color-text
    .my-header span
        color white
        display inline-block
        vertical-align top      
</style>


