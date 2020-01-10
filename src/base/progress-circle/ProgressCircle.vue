<template>
    <div class="progress-circle">
        <svg width="32" height="32" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-bar" r="50" cx="50" cy="50" 
                stroke-dasharray="314"
                :stroke-dashoffset="dashOffset"
                fill="transparent"  
            />
        </svg>
        <slot></slot>
    </div>
</template>
<script>
export default{
    name:'ProgressCircle',
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    computed:{
        dashOffset(){
            return (1-this.percent) *314
        }
    }
}
</script>
<style scoped lang="stylus">
    .progress-circle
        position relative
        circle
            stroke-width 8px
            transform-origin center
            &.progress-bar 
                transform scale(0.9) rotate(-90deg)
                stroke $color-theme-l
</style>