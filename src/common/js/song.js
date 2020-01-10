import {getSongsUrl,getLyric} from 'api/songs'
import {Base64} from 'js-base64'
export default class Song{
    constructor({id,mid,singer,name,album,duration,image,url,cloudLyric}){
        this.id=id
        this.mid=mid
        this.singer=singer
        this.name=name
        this.album=album
        this.duration=duration
        this.image=image
        this.url=url
        this.cloudLyric=cloudLyric
    }
    getLyric(){
        // 判断如果重复歌曲，就不去请求接口
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve)=>{
            getLyric(this.mid).then((res)=>{
                this.lyric=Base64.decode(res.lyric)
                resolve(this.lyric)
            })
        })
    }
}
// 后续很多地方会用到这个类，所以使用工厂函数
export function createSong(musicData){
    return new Song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        duration:musicData.interval,
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url:musicData.url
    })
}

function filterSinger(singer){
    let ret=[]
    if(!singer){
        return ''
    }
    singer.forEach((s)=>{
        ret.push(s.name)
    })
    return ret.join('/')
}
//处理歌曲列表
export function processSongsUrl(songs) {
    if (!songs.length) {
        return Promise.resolve(songs)
    }
    return getSongsUrl(songs).then((purlMap) => {
        songs = songs.filter((song) => {
            const purl = purlMap[song.mid]
            if (purl) {
                song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
                return true
            }
            return false
        })
        return songs
    })
}


//过滤掉付费歌曲
export function isVaildMusic(musicData){
    return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}
