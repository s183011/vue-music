<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper" ref="play" v-show="songs.length>0">
                <div class="play" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>   
                </div>
            </div>
            <div class="filter">
                
            </div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll 
            class="list" 
            ref="list" 
            @scroll="scroll" 
            :probeType="probeType"
            :listenScroll="listenScroll"
        >
            <div class="song-list-wrapper">
                <song-list 
                    :songs="songs"
                    :rank="rank"
                    @selectItem="select"
                ></song-list>
            </div>
            <loading class="loading" v-show="!songs.length"></loading>
        </scroll>
    </div>
</template>
<script>
import Scroll from 'base/scroll/Scroll'
import SongList from 'base/song-list/SongList'
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'
import Loading from 'base/loading/Loading'
export default{
    name:'MusicList',
    data(){
        return {
            scrollY:0
        }
    },
    mixins:[playListMixin],
    props:{
        title:{
            type:String,
            default:''
        },
        bgImage:{
            type:String,
            default:''
        },
        songs:{
            type:Array,
            default:[]
        },
        rank:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        handlePlayList(playList){
             const bottom=playList.length>0?'60px':''
             this.$refs.list.$el.style.bottom=bottom
             this.$refs.list.refresh()
        },
        // 随机播放按钮
        random(){
            this.randomPlay({
                list:this.songs
            })
        },
        select(item,index){
            this.selectPlay({
                list:this.songs,
                index
            })
        },
        back(){
            this.$router.back()
        },
        scroll(pos){
            this.scrollY=pos.y
        },
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ])
    },
    components:{
        Scroll,
        SongList,
        Loading
    },
    created(){
        this.probeType=3
        this.listenScroll=true
        // 浏览器厂商
        // const el=document.createElement('div').style
        // console.log(el)
    },
    mounted(){
        // 背景图片高度
        this.bgHeight=this.$refs.bgImage.clientHeight
        // layer层可以滚动的最大高度，就是你最多最多能滚动到这
        this.maxHeight=-this.bgHeight+50
        this.$refs.list.$el.style.top=`${this.bgHeight}px`
    },
    watch:{
        scrollY(newY){
            //console.log(newY)
            let translateY=Math.max(this.maxHeight,newY)
            this.$refs.layer.style.transform=`translate3d(0,${translateY}px,0)`
            let zIndex=0
            //图片缩放逻辑
            let scale=1
            let percent=Math.abs(newY/this.bgHeight)
            if(newY>0){
                scale+=percent
                zIndex=10
            }
            this.$refs.bgImage.style.transform=`scale(${scale})`
            //上拉到最大值，相关逻辑：修改图片高度和z-index
            if(newY<translateY){
                zIndex=10
                this.$refs.bgImage.style.paddingTop=0
                this.$refs.play.style.display='none'
                this.$refs.bgImage.style.height='50px'
            }else{
                this.$refs.bgImage.style.paddingTop='70%'
                this.$refs.bgImage.style.height=0
                this.$refs.play.style.display=''
            }
            this.$refs.bgImage.style.zIndex=zIndex
        }
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    }
}
</script>
<style lang="stylus" scoped>
    .music-list
        position fixed
        top 0
        bottom 0
        right 0 
        left 0
        z-index 100
        .back
            position absolute
            top 0
            left 6px 
            z-index 50
            .icon-back
                display block
                padding 10px
                font-size 30px
                color $color-theme-l
        .title
            position: absolute
            top: 0
            left: 10%
            z-index: 40
            width: 80%
            text-align: center
            line-height: 50px
            font-size: $font-size-large
            color: $color-theme-l
        .bg-image
            position: relative
            width: 100%
            height: 0
            padding-top: 70%
            transform-origin: top
            background-size: cover
            background-color:black
            .play-wrapper
                position: absolute
                bottom: 20px
                z-index: 50
                width: 100%
                .play
                    box-sizing: border-box
                    width: 135px
                    padding: 7px 0
                    margin: 0 auto
                    text-align: center
                    border: 1px solid $color-theme-l
                    color: $color-theme-l
                    border-radius: 100px
                    .icon-play
                        display: inline-block
                        vertical-align: middle
                        margin-right: 6px
                        font-size: $font-size-medium-x
                    .text
                        display: inline-block
                        vertical-align: middle
                        font-size: $font-size-small
            .filter
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
        .bg-layer
            position relative
            height 100%
            background $color-theme
        .list
            position absolute
            top 0
            bottom 0
            width 100%
            background $color-theme
            .song-list-wrapper
                padding 20px 30px
            .loading
                position absolute
                top 50%
                width 100% 
                transform translateY(-50%) 
</style>