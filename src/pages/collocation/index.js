import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

@connect(({ collocation, loading }) => ({ collocation, loading }))
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
    const loading = this.props.loading.effects['collocation/getClassifications'];

    return (
      <Spin spinning={loading}>
        <div className={styles.classic}>搭配分类 | CLASSIC</div>
        <div className={styles.container}>
          {classifications.map(item => (
            <div
              key={item.collocation_style_id}
              onClick={this.clickClassic.bind(this, item.collocation_style_id)}
              className={styles.item}
            >
              <img src={item.style_icon} alt="" />
              <div className={styles.name}>{item.collocation_style_name}</div>
            </div>
          ))}
        </div>
      </Spin>
    );
  }
}

export default Index;
