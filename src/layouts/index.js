import router from 'umi/router';
import { Icon } from 'antd';
import styles from './index.css';

function BasicLayout(props) {
  const { pathname } = props.location;
  const goBack = () => {
    router.goBack();
  };
  const gotoStar = () => {
    router.push('/collocation/star');
  };
  return (
    <div>
      <div className={styles.topBar}>
        {pathname !== '/collocation' && (
          <span onClick={goBack} className={styles.goBack}>
            <Icon type="arrow-left" title="返回" />
          </span>
        )}
        <div className={styles.flex} />
        <Icon onClick={gotoStar} type="star" theme="filled" className={styles.star} title="收藏" />
      </div>
      {props.children}
    </div>
  );
}

export default BasicLayout;
