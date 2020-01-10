<template>
    <div class="loading">
        <img width="24" height="24" src="./loading.gif">
        <p class="desc">{{title}}</p>
    </div>
</template>
<script>
export default{
    name:'Loading',
    props:{
        title:{
            type:String,
            default:'正在载入...'
        }
    }
}
</script>
<style lang="stylus" scoped>
    .loading
        width 100%
        text-align center
        .desc
            color $color-text
            font-size 12px
            line-height 20px
</style>