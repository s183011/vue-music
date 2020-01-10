<template>
    <div class="recommend" ref="recommend">
        <scroll class="recommend-content" ref="scroll" :data="ownLikeList">
            <div>
                <div class="slide-wrapper" v-if="banner.length">
                    <div class="slide-content">
                        <slider :dots="banner">
                            <div v-for="(item,index) in banner" :key="index">
                                <img :src="item.picUrl" alt="">
                            </div>
                        </slider>
                    </div>
                </div>
                <div class="recommendList">
                    <h1 class="list-title">我喜欢的歌单</h1>
                    <ul class="list">
                        <li class="list-item"
                            @click="enterDisc(item)"
                            v-for="(item,index) in ownLikeList"
                            :key="index">
                            <img :src="item.imgUrl" alt="">
                            <p>{{item.name}}</p>
                        </li>
                    </ul>
                </div>
                <div class="recommendList">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul class="list">
                        <li class="list-item" @click="enterDisc(item)" v-for="(item,index) in recommend" :key="index">
                            <img :src="item.imgUrl" alt="">
                            <p>{{item.name}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <loading v-show="!ownLikeList.length"></loading>     
        </scroll>
        <router-view></router-view> 
    </div>
</template>
<script>
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/Slider'
import Scroll from 'base/scroll/Scroll'
import Loading from 'base/loading/Loading'
import axios from 'axios'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import Disc from 'common/js/disc'
export default {
    name:'Recommend',
    mixins:[playListMixin],
    components:{
        Slider,
        Scroll,
        Loading
    },
    data(){
        return {
            banner:[],
            recommend:[],
            ownLikeList:[]
        }
    },
    mounted(){
        this.$refs.scroll.refresh()
    },
    created(){
        this._getRecommend()
        this._getRecommendList()
    },
    methods:{
        ...mapMutations({
            setDisc:'SET_DISC'
        }),
        enterDisc(item){
            this.$router.push({
                path:`/recommend/${item.id}`
            })
            this.setDisc(item)
        },
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.recommend.style.bottom=bottom
            this.$refs.scroll.refresh()
        },
        _getRecommend(){
            getRecommend().then((res)=>{
                if(ERR_OK===0){
                    this.banner=res.data.slider
                }
            })
        },
        _getRecommendList(){
            axios({
            url:'http://musicapi.xiecheng.live/login?email=15535923792@163.com&password=s15535923792'
            }).then((res)=>{
                axios({
                    url:'http://musicapi.xiecheng.live/user/playlist?uid=1639867649'
                }).then((res)=>{
                    const list=res.data.playlist
                    list.forEach((item)=>{
                        this.ownLikeList.push(new Disc({
                            id:item.id,
                            name:item.name,
                            imgUrl:item.coverImgUrl
                        }))
                    })
                })
                // 获取动态
                // axios({
                //     url:'http://localhost:3000/user/event?uid=118431000'
                // }).then((res)=>{
                //     console.log(res.data)
                // })
                // 获取关注  
                // axios({
                //     url:'http://localhost:3000/user/follows?uid=1639867649'
                // }).then((res)=>{
                //     console.log(res.data)
                // })
                // 取消关注
                // axios({
                //     url:'http://localhost:3000/follow?id=82760201&t=2'
                // }).then((res)=>{
                //     console.log(res.data)
                // })
                // 获取播放记录
                // axios({
                //     url:'http://localhost:3000/user/record?uid=1639867649'
                // }).then((res)=>{
                //     console.log(res.data)
                // })
                // 获取歌手列表
                // axios({
                //     url:'http://localhost:3000/toplist/artist'
                // }).then((res)=>{
                //     console.log(res.data)
                // })
                axios({
                    url:
                    "http://musicapi.xiecheng.live/recommend/resource"
                }).then((res)=>{ 
                    const list=res.data.recommend
                    list.forEach((item)=>{
                        this.recommend.push(new Disc({
                            id:item.id,
                            name:item.name,
                            imgUrl:item.picUrl
                        }))
                    })
                })
            }).catch((error)=>{
                console.log(error.response)
            })
        }
        // _getDiscList(){
        //     getDiscList().then((res)=>{
        //         if(ERR_OK===0){
                    
        //         }
        //     })
        // }
    }
}
</script>
<style lang="stylus" scoped>
    .recommend
        background $color-theme
        position fixed
        top 88px
        bottom 0
        width 100%
        .recommend-content
            height 100%
            overflow hidden
        // @media screen and (min-width:360px) 
        //     background black   
        .slide-wrapper
            position relative
            width 100%
            height 0
            padding-top 40%
            overflow hidden
            .slide-content
                position absolute
                top 0 
                left 0
                width 100%
                height 100%
        .recommendList
            .list-title
                height 65px
                line-height 65px
                text-align center
                font-size $font-size-medium
                color $color-text
            .list
                overflow hidden
                display flex
                flex-wrap wrap
                .list-item
                    width 33%
                    text-align center
                    margin-bottom 10px
                    img
                        width 90%
                        border-radius 5px
                    p
                        width 90%
                        overflow hidden
                        text-overflow ellipsis
                        display -webkit-box
                        -webkit-box-orient vertical
                        -webkit-line-clamp 2
                        margin 0 auto
                        color $color-text
                        line-height 20px
                        text-align justify
                        font-size $font-size-small   
</style>


