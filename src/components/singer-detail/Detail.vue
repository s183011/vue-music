<template>
    <transition name="slide" appear>
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>    
</template>
<script>
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {createSong,isVaildMusic,processSongsUrl} from 'common/js/song'
import MusicList from 'components/music-list/MusicList'
export default{
    name:'Detail',
    data(){
        return {
            songs:[]
        }
    },
    components:{
        MusicList
    },
    computed:{
        ...mapGetters([
            'singer'
        ]),
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.avatar
        }

    },
    created(){
        this._getSingerDetail()
    },
    methods:{
        _getSingerDetail(){
            //处理边界情况,用户在歌手详情页刷新页面，让它返回到歌手页
            if(!this.singer.id){
                this.$router.push('/singer')
                return
            } 
            getSingerDetail(this.singer.id).then((res)=>{
                processSongsUrl(this._normalizeSongs(res.data.list)).then((songs)=>{
                    this.songs=songs
                })
            })
        },
        _normalizeSongs(list){
            let ret=[]
            list.forEach((item)=>{
                let {musicData}=item
                // console.log(musicData.songname)
                // console.log(isVaildMusic(musicData))
                if(isVaildMusic(musicData)){
                    ret.push(createSong(musicData))
                }
            })
            return ret
        }
    }
}
</script>
<style lang="stylus" scoped>
    .slide-enter-active,.slide-leave-active
        transition all .3s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)    
</style>         