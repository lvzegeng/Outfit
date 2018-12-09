import React, { Component } from 'react';
import { Icon, message } from 'antd';
const { clipboard, nativeImage } = require('electron');
const { app } = require('electron').remote;
import fs from 'fs';
import path from 'path';
import styles from './ImgAddTool.less';

class ImgAddTool extends Component {
  state = {
    star: !!JSON.parse(localStorage.getItem('star') || '[]').find(
      item => item.id === this.props.id
    ),
    download: JSON.parse(localStorage.getItem('download') || '[]').includes(
      this.props.img.split('/').pop()
    ),
  };

  imagesFolder = path.join(app.getPath('userData'), 'images');

  star = () => {
    const star = JSON.parse(localStorage.getItem('star') || '[]');
    const { id, img } = this.props;
    if (!star.find(item => item.id === id)) {
      localStorage.setItem(
        'star',
        JSON.stringify(
          star.concat({
            id,
            img,
          })
        )
      );
      this.setState({
        star: true,
      });
    } else {
      localStorage.setItem('star', JSON.stringify(star.filter(item => item.id !== id)));
      this.setState({
        star: false,
      });
    }
  };

  copy = () => {
    const { img } = this.props;
    fetch(img)
      .then(data => data.arrayBuffer())
      .then(data => {
        clipboard.writeImage(nativeImage.createFromBuffer(new Buffer(data)));
        message.success('图片复制成功');
      });
  };

  download = () => {
    const { img } = this.props;
    fs.stat(this.imagesFolder, (err, stats) => {
      if (err) {
        fs.mkdir(this.imagesFolder, err => {
          if (err) {
            message.error(err);
          } else {
            this.saveImg(img);
          }
        });
      } else {
        this.saveImg(img);
      }
    });
  };

  saveImg = img => {
    fetch(img)
      .then(data => data.arrayBuffer())
      .then(data => {
        fs.writeFile(path.join(this.imagesFolder, img.split('/').pop()), new Buffer(data), err => {
          if (err) {
            message.error(err);
          } else {
            const download = JSON.parse(localStorage.getItem('download') || '[]');
            localStorage.setItem('download', JSON.stringify(download.concat(img.split('/').pop())));
            this.setState({
              download: true,
            });
            message.success('图片保存成功');
          }
        });
      });
  };

  handleOpenFolder = e => {
    e.preventDefault();
    e.currentTarget.parentNode.click();
  };

  render() {
    const { className, img } = this.props;
    const { star, download } = this.state;
    return (
      <div className={className}>
        <img className={styles.img} src={img} alt="" />
        <div className={styles.tool}>
          {download ? (
            <a href={path.join(this.imagesFolder, img.split('/').pop())}>
              <Icon
                type="folder-open"
                className={styles.download}
                onClick={this.handleOpenFolder}
                title="打开文件位置"
              />
            </a>
          ) : (
            <Icon
              type="download"
              onClick={this.download}
              className={styles.download}
              title="下载图片"
            />
          )}
          {star ? (
            <Icon
              type="star"
              theme="filled"
              onClick={this.star}
              className={styles.active}
              title="取消收藏"
            />
          ) : (
            <Icon type="star" onClick={this.star} className={styles.star} title="收藏" />
          )}
          <Icon type="copy" onClick={this.copy} className={styles.copy} title="复制" />
        </div>
      </div>
    );
  }
}

export default ImgAddTool;
