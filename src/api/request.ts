import Taro from "@tarojs/taro";
import moment from "moment";

interface Response<T = any> {
    code: number;
    msg: string;
    data: T
}

export default function request<T = any>(options: Taro.request.Option): Promise<Response<T>> {
    return new Promise((resolve, reject) => {
        Taro.request<Response<T>>({
            ...options,
            url: process.env.TARO_APP_API + '/app-api' + options.url,
            header: {
                ...options.header,
                Authorization: Taro.getStorageSync('token')
            }
        }).then(res => {
            if (res.data.code === 0) {
                resolve(res.data)
            } else {
                Taro.atMessage({
                    type: 'error',
                    message: res.data.msg
                })
                reject(res.data)
            }
        }).catch(err => {
            Taro.atMessage({
                type: 'error',
                message: err.errMsg
            })
            reject(err)
        })
    })
}
