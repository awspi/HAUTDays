/**
 * 选择图片并自动转成base64编码（count：文件可选数，imgType：转base64时图片类型）
 * @param {*} maxSize 单位b
 */
 export function chooseImageToBase64(maxSize){
    return new Promise(async(resolve, reject) => {
        try {
            const {tempFiles}= await wx.chooseMedia({
                count:1,
                sizeType:['compressed'],//因为转为base64 开启压缩减少体积
                mediaType:['image'],
                sourceType:['album']
            })
            const {tempFilePath,size}=tempFiles[0]
            console.log(tempFilePath);
            const {type}=await wx.getImageInfo({src:tempFilePath})
            console.log(size);
            if(size>maxSize){
                reject('图片过大,请尝试取消原图或裁剪')
            }
            const manager=wx.getFileSystemManager()
            manager.readFile({
                filePath: tempFilePath, //要读取的文件的路径 (本地路径)
                encoding: "base64", //指定读取文件的字符编码
                success: res => { //成功的回调
                    //返回base64格式
                    const base64Str = 'data:image/' + type + ';base64,' + res.data
                    resolve(base64Str)
                }
            })
        } catch (error) {
            reject("上传失败"+error.errMsg)
        }
    })
}
