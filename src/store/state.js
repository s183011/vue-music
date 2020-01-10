import {playMode} from 'common/js/config'
import {storageSearch} from 'common/js/cache'
const state={
    singer:{},
    playing:false,
    fullScreen:false,
    playList:[],
    sequenceList:[],
    //语义化
    mode:playMode.sequence,
    currentIndex:-1,
    disc:{},
    rankDisc:{},
    searchHistory:storageSearch()
}
export default state