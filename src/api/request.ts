import Taro from "@tarojs/taro";

interface Response<T = any> {
    code: number;
    msg: string;
    data: T
}

export default function request<T>(options: Taro.request.Option): Promise<Response<T>> {
    return new Promise((resolve, reject) => {
        Taro.request<Response<T>>(options).then(res => {
            if (res.data.code === 0) {
                resolve(res.data)
            } else {
                Taro.atMessage({
                    type: 'success',
                    message: res.data.msg
                })
                reject(res.data)
            }
        }).catch(err => {
            Taro.atMessage({
                type: 'success',
                message: err
            })
            reject(err)
        })
    })
}
