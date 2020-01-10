<template>
    <div class="progress-bar" ref="progress" @click="onProgressClick">
            <div class="bar-inner">
                <div class="progress" ref="bar">

                </div>
                <div class="progress-btn-wrapper"
                     ref="btn"
                >
                    <div class="progress-btn"
                         @touchstart.prevent="onTouchStart"
                         @touchmove.prevent="onTouchMove"
                         @touchend="onTouchEnd"
                    ></div>
                </div>
        </div>            
    </div> 
</template>
<script>
export default{
    name:'Bar',
    props:{
        percentage:{
            type:Number,
            default:0
        }
    },
    created(){
        this.touch={}
    },
    methods:{
        onProgressClick(e){
            this._offset(e.offsetX)
            this._triggerPercent()
        },
        onTouchStart(e){
            this.touch.flag=true
            this.touch.startX=e.touches[0].pageX
            this.touch.currentWidth=this.$refs.bar.clientWidth
        },
        onTouchMove(e){
            if(!this.touch.flag){
                return
            }
            const delta=e.touches[0].pageX -this.touch.startX
            // 拖动进度条最大最小距离。最小0，最大xxx-16
            const offsetWidth=Math.min(Math.max(0,delta+this.touch.currentWidth),this.$refs.progress.clientWidth - 16)
            this._offset(offsetWidth)
        },
        onTouchEnd(){
            this.touch.flag=false
            this._triggerPercent()
        },
        _triggerPercent(){
            const totalWidth=this.$refs.progress.clientWidth-16
            const percent=this.$refs.bar.clientWidth/totalWidth
            this.$emit('changePercent',percent)
        },
        _offset(num){
            this.$refs.bar.style.width=`${num}px`
            this.$refs.btn.style.transform=`translate3d(${num}px,0,0)`
        }
    },
    watch:{
        percentage(newVal){
            //拖动权重最高
            //console.log(this.touch.flag) 拖动中为true,不执行以下逻辑，拖动完成为false，执行
            if(!this.touch.flag){
                const progressWidth=this.$refs.progress.clientWidth - 16
                const offsetWidth=progressWidth*newVal
                this._offset(offsetWidth)
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
    .progress-bar
        height: 30px
        .bar-inner
            position: relative
            top: 13px
            height: 4px
            background: $color-theme-d
        .progress
            position: absolute
            height: 100%
            background: $color-theme-l  
        .progress-btn-wrapper
            position: absolute
            left: -8px
            top: -13px
            width: 30px
            height: 30px
            .progress-btn
                position: relative
                top: 7px
                left: 7px
                box-sizing: border-box
                width: 16px
                height: 16px
                border: 3px solid $color-text
                border-radius: 50%
                background: $color-theme-l
</style>