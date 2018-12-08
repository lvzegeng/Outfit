import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import styles from './$collocationId.less';

@connect(({ collocation, loading }) => ({ collocation, loading }))
class $CollocationId extends Component {
  componentDidMount() {
    const { collocationId } = this.props.match.params;
    this.props.dispatch({
      type: 'collocation/getClassificationsItem',
      payload: {
        collocationId,
      },
    });
  }

  render() {
    const { classificationsItem } = this.props.collocation;
    const loading = this.props.loading.effects['collocation/getClassificationsItem'];
    const { img } = this.props.location.query;

    return (
      <Spin spinning={loading}>
        <div className={styles.container}>
          <img className={styles.bigImg} src={img} alt="" />
          {classificationsItem.map(item => (
            <div key={item.item_id}>
              <img className={styles.img} src={item.pic_url} alt="" />
              <a
                className={styles.title}
                target="_blank"
                href={`https://detail.tmall.com/item.htm?id=${item.num_iid}`}
              >
                {item.title}
              </a>
              <div>￥{item.coupon_price}</div>
            </div>
          ))}
        </div>
      </Spin>
    );
  }
}

export default $CollocationId;
