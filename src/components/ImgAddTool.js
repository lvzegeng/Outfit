import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './ImgAddTool.less';

class ImgAddTool extends Component {
  state = {
    star: JSON.parse(localStorage.getItem('star') || '[]').includes(this.props.id),
  };

  star = (e) => {
    e.preventDefault();
    const star = JSON.parse(localStorage.getItem('star') || '[]');
    const { id } = this.props;
    if (!star.includes(id)) {
      localStorage.setItem('star', JSON.stringify(star.concat(id)));
      this.setState({
        star: true,
      });
    } else {
      localStorage.setItem('star', JSON.stringify(star.filter(item => item !== id)));
      this.setState({
        star: false,
      });
    }
  };

  render() {
    const { className, img } = this.props;
    const { star } = this.state;
    return (
      <div className={className}>
        <img className={styles.img} src={img} alt="" />
        <div className={styles.tool}>
          <Icon type="download" className={styles.download} />
          {star ? (
            <Icon type="star" theme="filled" onClick={this.star} className={styles.active} />
          ) : (
            <Icon type="star" onClick={this.star} className={styles.star} />
          )}
        </div>
      </div>
    );
  }
}

export default ImgAddTool;
