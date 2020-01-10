<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" :class="{active:currentIndex===index}" v-for="(item,index) in dots" :key="index">

            </span>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
    name:"Slider",
    props:{
        dots:{
            type:Array,
            default:[]
        },
        loop:{
            type:Boolean,
            default:true
        },
        autoPlay:{
            type:Boolean,
            default:true
        },
        interval:{
            type:Number,
            default:2000
        }
    },
    data(){
        return{
            currentIndex:0
        }
    },
    mounted(){
        setTimeout(()=>{
            this._setSliderWidth()
            this._initSlider()
            if(this.autoPlay){
                this._play()
            }
        },20)
        window.addEventListener('resize',()=>{
            this._setSliderWidth(true)
            this.slider.refresh()
        })
    },
    methods:{
        _setSliderWidth(isResize){
            let children=this.$refs.sliderGroup.children
            let width=0
            let sliderWidth=this.$refs.slider.clientWidth
            for(var i=0;i<children.length;i++){
                let child=children[i]
                addClass(child,'slider-item') 
                child.style.width=sliderWidth+'px'
                width+=sliderWidth   
            } 
            if(this.loop&&!isResize){
                width+=2*sliderWidth
            }
            this.$refs.sliderGroup.style.width=width+'px'
        },
        _initSlider(){
            this.slider=new BScroll(this.$refs.slider,{
                scrollX:true,
                scrollY:false,
                momentum:false,
                snap:{
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
            })
            this.slider.on('scrollEnd',()=>{
                let pageIndex=this.slider.getCurrentPage().pageX
                this.currentIndex=pageIndex
                if(this.autoPlay){
                    clearTimeout(this.timer)
                    this._play()
                }
            })
        },
        _play(){
            this.timer=setTimeout(()=>{
                // let pageIndex=this.currentIndex+1
                // if(this.currentIndex===this.dots.length-1){
                //     pageIndex=0
                // }
                // this.slider.goToPage(pageIndex,0,400)
                this.slider.next()
            },this.interval)
        }
    }
}
</script>
<style lang="stylus" scoped>
    .slider
        min-height 1px
        .slider-group
            position relative
            overflow hidden
            white-space nowrap
            .slider-item
                float left
                box-sizing border-box
                overflow hidden
                text-align center
                img
                    display block
                    width 100%
        .dots
            position absolute
            right 0
            left 0
            bottom 12px
            transform translateZ(1px)
            text-align center
            font-size 0
            .dot
                display inline-block
                margin 0 4px
                width 8px
                height 8px
                border-radius 50%
                background $color-text-l
                &.active
                    width 20px
                    border-radius 5px
                    background $color-text-ll            
</style>

