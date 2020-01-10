import {mapGetters} from 'vuex'
export const playListMixin={
    mounted(){
        this.handlePlayList(this.playList)
    },
    activated(){
        this.handlePlayList(this.playList)
    },
    methods:{
        handlePlayList(){
            throw new Error('component must implement handlePlayList method')
        }
    },
    computed:{
        ...mapGetters([
            'playList'
        ])
    },
    watch:{
        playList(newVal){
            this.handlePlayList(newVal)
        }
    }
}