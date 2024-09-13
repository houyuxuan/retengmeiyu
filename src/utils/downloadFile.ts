/*
 * @Author: lihuihui
 * @Date: 2024-09-12 11:49:55
 * @LastEditors: lihuihui
 * @LastEditTime: 2024-09-13 15:06:09
 * @Description: 请填写简介
 */
import React from "react";
import Taro from "@tarojs/taro";

export async function downloadFile(fileUrl) {
  try {
    const res = await Taro.downloadFile({
      url: fileUrl, // 七牛云文件的 URL
    });
    if (res.statusCode === 200) {
      const filePath = res.tempFilePath;
      let fileType = fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
      const canOpenType = ["pptx", "xlsx", "docx", "pdf", "ppt", "xls", "doc"];
      if (canOpenType.includes(fileType)) {
        // 直接打开
        Taro.openDocument({
          filePath,
          fileType,
          success: function () {
            Taro.showToast({
              title: "文件打开成功",
              icon: "success",
              duration: 2000,
            });
          },
          fail: function () {
            Taro.showToast({
              title: "文件打开失败",
              icon: "none",
              duration: 2000,
            });
          },
        });
      } else {
        Taro.saveVideoToPhotosAlbum({
          filePath,
          success: function () {
            Taro.showToast({
              title: "文件保存成功",
              icon: "success",
              duration: 2000,
            });
          },
          fail: function (err) {
            if (
              err.errMsg === "saveVideoToPhotosAlbum:fail:auth denied" ||
              err.errMsg === "saveVideoToPhotosAlbum:fail auth deny" ||
              err.errMsg === "saveVideoToPhotosAlbum:fail authorize no response"
            ) {
              Taro.showModal({
                title: "提示",
                content: "需要您授权保存",
                showCancel: false,
                success: () => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                        Taro.showToast({
                          title: "获取权限成功，再次点击下载保存文件到相册。",
                          icon: "none",
                          duration: 2000,
                        });
                      } else {
                        Taro.showToast({
                          title: "获取权限失败，暂未下载。",
                          icon: "none",
                          duration: 2000,
                        });
                      }
                    },
                  });
                },
              });
            } else if (err.errMsg === "saveVideoToPhotosAlbum:fail api scope is not declared in the privacy agreement" ) {
              Taro.requirePrivacyAuthorize(
                {success: function() {
                  Taro.showToast({
                    title: "获取权限成功，再次点击下载保存文件到相册。",
                    icon: "none",
                    duration: 2000,
                  });
                }}
              )
            }
          },
        });
      }
    } else {
      Taro.showToast({
        title: "下载失败",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("下载文件出错:", error);
    Taro.showToast({
      title: "下载出错",
      icon: "none",
    });
  }
}
