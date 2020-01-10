<template>
    <transition name="slide" appear>
        <music-list class="disc" :rank="rank" :bgImage="bgImage" :title="title" :songs="songs"></music-list>
    </transition>    
</template>
<script>
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import MusicList from 'components/music-list/MusicList'
import {createSong,isVaildMusic,processSongsUrl} from 'common/js/song'
export default{
    name:'RankSecond',
    components:{
        MusicList
    },
    data(){
        return {
            songs:[],
            rank:true
        }
    },
    computed:{
        bgImage(){
            if(this.songs.length){
                return this.songs[0].image
            }
            return ''
        },
        title(){
            return this.rankDisc.topTitle
        },
        ...mapGetters([
            'rankDisc'
        ])
    },
    created(){
        this._getMusicList()
    },
    methods:{
        _getMusicList(){
            if(!this.rankDisc.id){
                this.$router.push('/rank')
                return
            }
            getMusicList(this.rankDisc.id).then((res)=>{
                processSongsUrl(this._normalizeSongs(res.songlist)).then((res)=>{
                    this.songs=res
                })
            })
        },
        _normalizeSongs(list){
            let ret=[]
            list.forEach((item)=>{
                let musicData=item.data
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