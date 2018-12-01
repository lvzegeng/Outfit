import React, {Component} from 'react';
import {connect} from 'dva';
import styles from './$collocationId.less'

@connect(({collocation})=>({collocation}))
class $CollocationId extends Component {
  componentDidMount() {
    const {collocationId} = this.props.match.params
    this.props.dispatch({type:'collocation/getClassificationsItem', payload:{
        collocationId
      }})
  }

  render() {
    const {classificationsItem} = this.props.collocation
    return (
      <div className={styles.container}>
        {
          classificationsItem.map(item=><div key={item.item_id}>
            <img src={item.pic_url} alt=""/>
            <div>{item.title}</div>
            <div>￥{item.coupon_price}</div>
            <a target='_blank' href={`https://detail.tmall.com/item.htm?id=${item.num_iid}`}>https://detail.tmall.com/item.htm?id={item.num_iid}</a>
          </div>)
        }
      </div>
    );
  }
}

export default $CollocationId;
