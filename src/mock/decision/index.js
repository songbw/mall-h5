import Mock from 'mockjs'

export default {
    getAppConfig:()=> ({
        code:1,
        msg:"Success",
        data: {
            iAppId: '11',
            tAppId: '',
            serverUrl: 'https://testapi.weesharing.com',
            servicePhone: '88888888',
            goodsUrlPrefix: 'https://iwallet-1258175138.image.myqcloud.com',
            mallTitle: '君上店',
            platformId: 1 //'平台ID：1. 无锡市民卡App 2. 灵锡App 3. 凤巢公众号 ...'
        }
    })
}
