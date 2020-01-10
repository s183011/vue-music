import {commonParams} from './config'
import {getUid} from 'common/js/uid'
import axios from 'axios'

export async function getSongsUrl(songs) {
    const url = '/api/getPurlUrl'

    let mids = []
    let types = []

    songs.forEach((song) => {
        // 搜索接口有歌手的情况下
        if(song.type==='singer'){
            return
        }
        mids.push(song.mid)
        types.push(0)
    })

    const urlMid = genUrlMid(mids, types)

    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        format: 'json',
        platform: 'h5',
        needNewCode: 1,
        uin: 0
    })

    const res = await axios.post(url, {
        comm: data,
        req_0: urlMid
    });
    const urlMid_1 = res.data.req_0.data.midurlinfo;
    const purlMap = {};
    urlMid_1.forEach((item) => {
        if (item.purl) {
            purlMap[item.songmid] = item.purl;
        }
    });
    return Promise.resolve(purlMap);
}

function genUrlMid(mids, types) {
    const guid = getUid()
    return {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
            guid,
            songmid: mids,
            songtype: types,
            uin: '0',
            loginflag: 0,
            platform: '23'
        }
    }
}

// 获取歌词
export function getLyric(mid){
    const url="/api/getLyric"
    const data=Object.assign({},commonParams,{
        songmid:mid,
        pcachetime:+new Date(),
        platform:'yqq',
        hostUin:0,
        needNewCode:0,
        g_tk:67232076,
        format:'json'
    })
    return axios.get(url, {
        params: data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}