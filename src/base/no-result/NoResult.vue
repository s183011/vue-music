<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{title}}</p>
    </div>
</template>
<script>
export default{
    name:'NoResult',
    props:{
        title:{
            type:String,
            default:''
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .no-result
        text-align: center
        .no-result-icon
            width: 86px
            height: 90px
            margin: 0 auto
            bg-image('no-result')
            background-size: 86px 90px
            filter brightness(4.5)
        .no-result-text
            margin-top: 30px
            font-size: $font-size-medium
            color: $color-text
</style>