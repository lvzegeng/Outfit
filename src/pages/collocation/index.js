import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

@connect(({ collocation }) => ({ collocation }))
class Index extends Component {
  componentDidMount() {
    const { classifications } = this.props.collocation;
    if (!classifications.length) {
      this.props.dispatch({ type: 'collocation/getClassifications' });
    }
  }

  clickClassic = id => {
    router.push(`${this.props.location.pathname}/${id}`);
  };

  render() {
    const { classifications } = this.props.collocation;
    return (
      <div>
        <div>搭配分类 | CLASSIC</div>
        <div className={styles.container}>
          {classifications.map(item => (
            <div
              key={item.collocation_style_id}
              onClick={this.clickClassic.bind(this, item.collocation_style_id)}
              className={styles.item}
            >
              <img src={item.style_icon} alt="" />
              <div>{item.collocation_style_name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Index;
