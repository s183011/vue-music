<template>
    <div class="player" v-show="playList.length>0">
        <transition 
            name="normal" 
            appear
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @afterLeave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" :src="currentSong.image" height="100%" alt="">
                </div>
                <div class="top">
                    <div class="back" @click="close">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" 
                    @touchstart.prevent="middleTouchStart"
                    @touchmove.prevent="middleTouchMove"
                    @touchend="middleTouchEnd"
                >
                    <div class="middle-l" ref="cd">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img :class="cdCls" :src="currentSong.image" class="image" alt="">
                            </div>
                        </div> 
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div> 
                        </div>  
                    </div>
                    <scroll class="middle-r" ref="lyricList">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p 
                                    ref="lyricLine"
                                    class="text"
                                    :class="{active:currentLyricNum===index}"
                                    v-for="(line,index) in currentLyric.lines"
                                    :key="index"
                                >
                                    {{line.txt}}
                                </p>
                            </div>
                        </div>
                    </scroll> 
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <bar :percentage="percentage"
                                @changePercent="percentChange"
                            ></bar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" @click="prev">
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i :class="playIcon" @click="togglePlay"></i>
                        </div>
                        <div class="icon i-right" @click="next">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini" appear>
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <div class="img-wrapper">
                        <img :class="cdCls" :src="currentSong.image" width="40" height="40" alt="">
                    </div>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :percent="percentage">
                        <i class="icon-mini" @click.stop="togglePlay" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>   
        <audio 
            :src="currentSong.url" 
            @timeupdate="updateTime"
            @ended="end"
            ref="audio"
        ></audio> 
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import Bar from 'base/progress-bar/Bar'
import ProgressCircle from 'base/progress-circle/ProgressCircle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/Scroll'
export default {
    name:'Player',
    components:{
        Bar,
        ProgressCircle,
        Scroll
    },
    created(){
        this.touch={}
    },
    computed:{
        // 播放模式
        iconMode(){
            return this.mode===playMode.sequence?'icon-sequence':this.mode===playMode.random?'icon-random':'icon-loop'
        },
        percentage(){
            return this.currentTime / this.currentSong.duration
        },
        cdCls(){
            return this.playing?'play':'play pause'
        },
        playIcon(){
            return this.playing?'icon-pause':'icon-play'
        },
        miniIcon(){
            return this.playing?'icon-pause-mini':'icon-play-mini'
        },
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentIndex',
            'currentSong',
            'playing',
            'mode',
            'sequenceList'
        ])
    },
    data(){
        return {
            currentTime:0,
            currentLyric:null,
            currentLyricNum:0,
            currentShow:'cd',
            playingLyric:''
        }
    },
    methods:{
        //网易云歌词
        getCloudLyric(){
            this.playingLyric=''
            if(this.currentSong.cloudLyric){
                this.currentLyric=new Lyric(this.currentSong.cloudLyric,this.handleLyric)
                if(this.playing){
                    this.currentLyric.play()
                }
            }else{
                this.currentLyric=null
                this.currentLyricNum=0
            }
        },
        // 歌词和cd切换逻辑
        middleTouchStart(e){
            this.touch.flag=true
            const touch=e.touches[0]
            this.touch.startX=touch.pageX
            this.touch.startY=touch.pageY
        },
        middleTouchMove(e){
            if(!this.touch.flag){
                return
            }
            const touch=e.touches[0]
            const deltaX=touch.pageX-this.touch.startX
            const deltaY=touch.pageY-this.touch.startY
            // 纵轴偏移大于横轴偏移，就判断他为纵向滚动，不发生任何逻辑
            if(Math.abs(deltaY)>Math.abs(deltaX)){
                return
            }
            // 维护一个left
            const left=this.currentShow==='cd'?0:-window.innerWidth
            // currentShow为cd的时候,left=0,左滑，offsetWdith=deltaX,右滑，deltaX>0,此时offsetWidth为0
            //currrentShow不为cd，left=-375,左滑，deltaX<0，此时offsetWidth=-375,也就是不动。
            const offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX))
            // console.log(offsetWidth)
            // console.log(deltaX)
            this.touch.percent=Math.abs(offsetWidth/window.innerWidth).toFixed(1)
            // console.log(Math.abs(deltaX/window.innerWidth))
            // console.log(this.touch.percent.toFixed(1)) 
            this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
            this.$refs.cd.style.opacity=1-this.touch.percent
            this.$refs.lyricList.$el.style.transition='all 0s'
        },
        middleTouchEnd(){
            let offsetWidth
            let opacity
            if(this.currentShow==='cd'){
                if(this.touch.percent>0.3){
                    offsetWidth=-window.innerWidth
                    opacity=0
                    this.currentShow='lyric'
                }else{
                    offsetWidth=0
                    opacity=1
                }
            }else{
                if(this.touch.percent<0.7){
                    offsetWidth=0
                    opacity=1
                    this.currentShow='cd'
                }else{
                    opacity=0
                    offsetWidth=-window.innerWidth
                }
            }
            this.$refs.lyricList.$el.style.transform=`translate3d(${offsetWidth}px,0,0)`
            this.$refs.cd.style.opacity=opacity
            this.$refs.lyricList.$el.style.transition='all 0.5s'
        },
        //获取歌词
        getLyric(){
            //处理边界情况
            if(!this.currentSong.mid){
                return
            }
            this.currentSong.getLyric().then((res)=>{
                this.currentLyric=new Lyric(res,this.handleLyric)
                if(this.playing){
                    this.currentLyric.play()
                }
            })
        },
        handleLyric({lineNum,txt}){  
            this.currentLyricNum=lineNum
            if(lineNum>5){
                this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum-5],1000)
            }else{
                this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric=txt
        },
        // 当前歌曲结束
        end(){
            if(this.mode===playMode.loop){
                this.loop()
            }else{
                this.next()
            }
        },
        //loop模式
        loop(){
            this.$refs.audio.currentTime=0
            if(this.currentLyric){
                this.currentLyric.seek(0)
            }
            this.$refs.audio.play()
        },
        // 播放模式切换
        changeMode(){
            let mode=(this.mode+1)%3
            this.setMode(mode)
            shuffle(this.sequenceList)
            let list=[]
            if(this.mode===playMode.random){
                list=shuffle(this.sequenceList)
            }else{
                list=this.sequenceList
            }
            // 验证arr.slice()歌曲列表是否会被改变，不会。创建的是副本
            // for(let v in list){
            //     console.log(list[v].name)
            // }
            this._resetIndex(list)
            this.setPlayList(list)
        },  
        _resetIndex(list){
            let index=list.findIndex((item)=>{
                return item.id===this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        //拖动或者点击，传过来的percent
        percentChange(percent){
            const currentTime=this.currentSong.duration*percent
            this.$refs.audio.currentTime=currentTime
            if(this.currentLyric){
                this.currentLyric.seek(currentTime*1000)
            }
            if(!this.playing){
                this.togglePlay()
            }
        },
        // 格式化时间 interval 间隔 format 格式
        //只要currentTime变化，这个函数就会被调用
        format(interval){
            //console.log(1)
            interval=interval | 0
            const min=interval/60 | 0
            let second=interval % 60
            if(second<10){
                second=`0${second}`
            }
            return `${min}:${second}`
        },
        // 当前播放时间
        updateTime(e){
            this.currentTime=e.target.currentTime
        },
        //播放暂停功能
        togglePlay(){
            if(this.currentLyric){
                this.currentLyric.togglePlay()
            }
            this.setPlaying(!this.playing)
        },
        next(){
            let index=this.currentIndex+1
            if(index===this.playList.length){
                index=0
            }
            this.setCurrentIndex(index)
            //上一首歌曲，暂停。当点击下一首，playing由false变为true，需要手动设置一下。
            if(!this.playing){
                this.togglePlay()
            }
        },
        prev(){
            let index=this.currentIndex-1
            if(index===-1){
                index=this.playList.length-1
            }
            this.setCurrentIndex(index)
            if(!this.playing){
                this.togglePlay()
            }
        },
        //cd飞入动画
        enter(el,done){
            const {x,y,scale}=this._getPosAndScale()
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter(){
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el,done){
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x,y,scale}=this._getPosAndScale()
            this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend',done)
        },
        afterLeave(){
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style.transform = ''
        },
        // 获取初始大CD，动画初始位置
        _getPosAndScale(){
            const x=-(window.innerWidth/2-40)
            const y=window.innerHeight-30-80-window.innerWidth/2
            const scale=40/(window.innerWidth*0.8)
            return {
                x,
                y,
                scale
            }
        },
        close(){
            this.setFullScreen(false)
        },
        open(){
            this.setFullScreen(true)
        },
        ...mapMutations({
            setFullScreen:'SET_FULL_SCREEN',
            setPlaying:'SET_PLAYING',
            setCurrentIndex:'SET_CURRENT_INDEX',
            setMode:'SET_MODE',
            setPlayList:'SET_PLAY_LIST'   
        })
    },
    watch:{
        currentSong(newSong,oldSong){
            if(newSong.id===oldSong.id){
                return
            }
            //lyric类内部有定时器，不清除歌词会闪动
            if(this.currentLyric){
                this.currentLyric.stop()
            }
            this.$nextTick(()=>{
                this.$refs.audio.play()
            })
            this.getLyric()
            this.getCloudLyric()
        },
        playing(){
            const audio=this.$refs.audio
            this.$nextTick(()=>{
                this.playing?audio.play():audio.pause()
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-text
            color white
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: 30px
                        color: $color-theme-l
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-theme
                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-theme
            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%
                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        box-sizing: border-box
                        height: 100%
                        .cd
                            width: 100%
                            height: 100%
                            border-radius: 50%
                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                box-sizing: border-box
                                border-radius: 50%
                    .playing-lyric-wrapper
                        width 80%
                        margin 30px auto 0
                        overflow hidden
                        text-align center
                        .playing-lyric
                            height 20px
                            line-height 20px
                            font-size 14px  
                            color $color-theme-l
                .middle-r
                    display inline-block
                    vertical-align top
                    width 100%
                    height 100%
                    overflow hidden
                    .lyric-wrapper
                        width 80%
                        margin 0 auto
                        overflow hidden
                        text-align center
                        .text
                            line-height 32px
                            color $color-theme-d
                            font-size 14px
                            &.active
                                color $color-theme-l
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
                @media screen and (max-width:360px) 
                    bottom 30px 
                .dot-wrapper
                    text-align center
                    font-size 0
                    .dot
                        display inline-block
                        vertical-align middle
                        margin 0 4px
                        width 8px
                        height 8px
                        border-radius 50%
                        background $color-theme-d
                        &.active
                            width 20px
                            border-radius 5px
                            background $color-theme-l
                .progress-wrapper
                    display flex
                    aligin-items center
                    width 80%
                    margin 0 auto
                    padding 10px 0
                    .time
                        color $color-theme
                        font-size $font-size-small
                        flex 0 0 30px
                        line-height 30px
                        width 30px
                    .time-l
                        text-align left
                    .time-r
                        text-align right
                    .progress-bar-wrapper
                        flex 1
                .operators
                    color $color-theme-l
                    display: flex
                    align-items: center
                    .icon
                        flex: 1
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 30px
                    .i-left
                        text-align: right
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i
                            font-size: 40px
                    .i-right
                        text-align: left
                    .icon-favorite
                        color: $color-sub-theme
            &.normal-enter-active,&.normal-leave-active
                transition all 0.4s
                .top,.bottom
                    transition all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
            &.normal-enter,&.normal-leave-to
                opacity 0
                .top
                    transform translate3d(0,-100px,0)
                .bottom
                    transform translate3d(0,100px,0)
        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-theme-d
            &.mini-enter-active,&.mini-leave-active
                transition all 0.4s
            &.mini-enter,&.mini-leave-to
                opacity 0    
            .icon
                flex: 0 0 40px
                width: 40px
                height: 40px
                padding: 0 10px 0 20px
                .img-wrapper
                    height: 100%
                    width: 100%
                    img
                        border-radius: 50%
                    .play
                        animation cdRorate 10s linear infinite
                    .pause
                        animation-play-state paused
            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-l
            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: rgba(255,255,255,0.5)
                .icon-mini
                    font-size: 32px
                    position absolute 
                    top 0
                    left 0
    .play
        animation  cdRorate 20s linear infinite
    .pause 
        animation-play-state paused   
    @keyframes cdRorate{
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>