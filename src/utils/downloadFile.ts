/*
 * @Author: lihuihui
 * @Date: 2024-09-12 11:49:55
 * @LastEditors: lihuihui
 * @LastEditTime: 2024-09-12 13:56:28
 * @Description: 请填写简介
 */
import React from 'react';
import Taro from '@tarojs/taro';

export async  function downloadFile(fileUrl, name) {
  try {
    const res = await Taro.downloadFile({
      url: fileUrl, // 七牛云文件的 URL
    });
    if (res.statusCode === 200) {
      console.log(res.tempFilePath)
      // 在微信小程序中，使用 Taro.saveFile 保存文件
      Taro.saveFile({
        tempFilePath: res.tempFilePath,
        filePath: `${Taro.env.USER_DATA_PATH}/${name}`,
        success: function(result) {
          Taro.showToast({
            title: `下载成功，文件路径为${result.savedFilePath}`,
            icon: 'none',
            duration: 2000
          });
        }
      });
      // Taro.saveVideoToPhotosAlbum({
      //   filePath: res.tempFilePath,
      //   success: function (result) {
      //     console.log(result);
      //     Taro.showToast({
      //       title: `下载成功，文件保存在系统相册中`,
      //       icon: 'none',
      //       duration: 2000
      //     });
      //   }
      // })
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
