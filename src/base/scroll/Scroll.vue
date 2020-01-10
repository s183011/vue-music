<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props:{
        probeType:{
            type:Number,
            default:1
        },
        click:{
            type:Boolean,
            default:true
        },
        data:{
            type:Array,
            default:null
        },
        listenScroll:{
            type:Boolean,
            default:false
        },
        pullup:{
            type:Boolean,
            default:false
        }
    },
    mounted(){
        setTimeout(()=>{
            this._initScroll()
        },20)
    },
    methods:{
        _initScroll(){
            if(!this.$refs.wrapper){
                return 
            }
            this.scroll=new BScroll(this.$refs.wrapper,{
                probeType:this.probeType,
                click:this.click
            })
            if(this.listenScroll){
                this.scroll.on('scroll',(pos)=>{
                    this.$emit('scroll',pos)
                })
            }
            if(this.pullup){
                this.scroll.on('scrollEnd',()=>{
                    // console.log(this.scroll.maxScrollY)
                    // console.log(this.scroll.y)
                    if(this.scroll.y<=this.scroll.maxScrollY+50){
                        // console.log(1)
                        this.$emit('scrollToEnd')    
                    }
                })
            }
        },
        enable(){
            this.scroll&&this.scroll.enable()
        },
        disable(){
            this.scroll&&this.scroll.disable()
        },
        refresh(){
            this.scroll && this.scroll.refresh()
        },
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
        }
    },
    watch:{
        data(){
            setTimeout(()=>{
                console.log(1)
                this.refresh()
            },20)
        }
    }
}
</script>
