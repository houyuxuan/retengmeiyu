import React from 'react';
import Taro from '@tarojs/taro';

export async  function downloadFile(fileUrl) {
  try {
    const res = await Taro.downloadFile({
      url: fileUrl, // 七牛云文件的 URL
    });
    console.log('download res', res);
    if (res.statusCode === 200) {
      // 在微信小程序中，使用 Taro.saveFile 保存文件
      const savedFilePath = await Taro.saveFile({
        tempFilePath: res.tempFilePath,
      });

      Taro.showToast({
        title: `下载成功，文件保存在${savedFilePath}路径下`,
        icon: 'success',
      });
      console.log('文件保存路径:', savedFilePath);
    } else {
      Taro.showToast({
        title: '下载失败',
        icon: 'none',
      });
    }
  } catch (error) {
    console.error('下载文件出错:', error);
    Taro.showToast({
      title: '下载出错',
      icon: 'none',
    });
  }
}