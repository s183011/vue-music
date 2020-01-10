<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag">
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">确定清空所有搜索历史？</p>
                    <div class="operate">
                        <div class="operate-btn left" @click="cancle">取消</div>
                        <div class="operate-btn" @click="clear">清空</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default{
    name:"Confirm",
    data(){
        return {
            showFlag:false
        }
    },
    methods:{
        show(){
            this.showFlag=true
        },
        hide(){
            this.showFlag=false
        },
        clear(){
            this.hide()
            this.$emit('clear')
        },
        cancle(){
            this.hide()
            this.$emit('cancle')
        }
    }
}
</script>
<style lang="stylus" scoped>
    .confirm
        position fixed
        left 0
        right 0
        top 0
        bottom 0
        z-index 998
        background rgba(168,30,50,0.5)
        &.confirm-fade-enter-active
            animation confirm-fadein 0.3s
            .confirm-content 
                animation confirm-zoom 0.3s
        .confirm-wrapper
            position absolute
            top 50%
            left 50%
            transform translate(-50%,-50%)
            z-index 999
            .confirm-content
                width 270px
                border-radius 13px
                background $color-theme-d
                .text
                    padding 19px 15px
                    line-height 22px
                    text-align center
                    font-size $font-size-large
                    color $color-text
                .operate
                    display flex
                    align-items center
                    text-align center
                    font-size $font-size-large
                    .operate-btn
                        flex 1
                        line-height 22px
                        padding 10px 0
                        border-top 1px solid #222
                        color $color-text
                        &.left
                            border-right 1px solid #222
    @keyframes confirm-fadein
        0% 
            opacity 0
        100% 
            opacity 1
    @keyframes confirm-zoom 
        0%
            transform scale(0)
        50%
            transform scale(1.2)
        100%
            transfrom scale(1)
    
</style>