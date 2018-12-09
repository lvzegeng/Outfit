import React, { Component } from 'react';
import router from 'umi/router';
import styles from './star.less';
import ImgAddTool from '../../components/ImgAddTool';

class index extends Component {
  toInfo = (record, e) => {
    if (e.target.nodeName === 'DIV' || e.target.nodeName === 'IMG') {
      router.push(`${this.props.location.pathname}/${record.id}?img=${record.img}`);
    }
  };

  render() {
    const star = JSON.parse(localStorage.getItem('star') || '[]');
    return (
      <div className={styles.container}>
        {star.map(item => (
          <div onClick={this.toInfo.bind(this, item)} key={item.id} className={styles.item}>
            <ImgAddTool img={item.img} id={item.id} />
            <div className={styles.info}>{item.info}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default index;
