<template>
    <scroll ref="suggest" :data="result" class="suggest" :pullup="pullup" @scrollToEnd="searchMore">
        <ul class="suggest-list">
            <li class="suggest-item" @click="selectItem(item)" v-for="(item,index) in result" :key="index">
                <div class="icon" :class="getIconCls(item)">
                    <i></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore"></loading>
        </ul>
        <div class="wrapper" v-show="!hasMore && !result.length">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>
<script>
import {getSuggest} from 'api/search'
import {createSong,processSongsUrl,isVaildMusic} from 'common/js/song'
import Scroll from 'base/scroll/Scroll'
import {playListMixin} from 'common/js/mixin'
import Loading from 'base/loading/Loading'
import {mapMutations} from 'vuex'
import {mapActions} from 'vuex'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/NoResult'
const perpage=20
export default{
    name:'Suggest',
    props:{
        query:{
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:true
        }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    },
    data(){
        return{
            page:1,
            result:[],
            pullup:true,
            hasMore:true
        }
    },
    watch:{
        query(){
            this.search()
        }
    },
    methods:{
        selectItem(item){
            // console.log(item)
            if(item.type==='singer'){
                const singer=new Singer({
                    id:item.singermid,
                    name:item.singername
                })
                this.$router.push({
                    path:`/search/${item.id}`
                })
                this.setSinger(singer)
            }else{
                // console.log(item)
                this.insertSong(item)
            }
            this.$emit('select')
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ]),
        search(){
            this.page=1
            this.$refs.suggest.scrollTo(0,0)
            this.hasMore=true
            this.result=[]
            getSuggest(this.query,this.page,this.showSinger,perpage).then((res)=>{
                let songList=this._genResult(res.data)
                // console.log(songs)
                if(songList.length && songList[0].type){
                    this.result=songList.slice(0,1)
                }
                processSongsUrl(songList).then((songs)=>{
                    this.result=this.result.concat(songs)
                })
                this.checkMore(res.data)
            })
        },
        searchMore(){
            // console.log(this.hasMore)
            if(!this.hasMore){
                return
            }
            this.page++
            getSuggest(this.query,this.page,false,perpage).then((res)=>{
                processSongsUrl(this._genResult(res.data)).then((songs)=>{
                    this.result=this.result.concat(songs)
                })
                this.checkMore(res.data)
            })
        },
        checkMore(data){
            const song=data.song
            if(!song.list.length || song.curpage * perpage>song.totalnum){
                this.hasMore=false
            }
        },
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.singer.style.bottom=bottom
            this.$refs.list.refresh()
        },
        getDisplayName(item){
            if(item.type==='singer'){
                return item.singername
            }else{
                return `${item.name}-${item.singer}`
            }
        },
        getIconCls(item){
            if(item.type==='singer'){
                return 'icon-mine'
            }else{
                return 'icon-music'
            }
        },
        _genResult(data){
            let ret=[]
            if(data.zhida && data.zhida.singerid){
                ret.push({...data.zhida,...{type:'singer'}})
            }
            if(data.song){
                // processSongsUrl(this._processList(data.song.list)).then((songs)=>{
                //     ret=ret.concat(songs)
                //     console.log(ret)
                // })
                ret=ret.concat(this._processList(data.song.list))
            }
            return ret
        },
        _processList(list){
            let ret=[]
            list.forEach((item)=>{
                // console.log(item.songname)
                // console.log(isVaildMusic(item))
                if(isVaildMusic(item)){
                    ret.push(createSong(item))
                }
            })
            return ret
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .suggest
        height 100%
        overflow hidden
        .wrapper
            position absolute
            top 50%
            width 100%
            transform translateY(-50%)
        .suggest-list
            padding 0 30px
            .suggest-item
                color $color-text
                display flex
                align-items center
                padding-bottom 20px
                .icon
                    flex 0 0 30px
                    width 30px
                .name
                    flex 1
                    font-size 14px
                    overflow hidden
                    .text
                        no-wrap()
</style>