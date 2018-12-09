import router from 'umi/router';
import { Icon } from 'antd';
import styles from './index.css';

function BasicLayout(props) {
  const { pathname } = props.location;
  const goBack = () => {
    router.goBack();
  };
  return (
    <div>
      {pathname !== '/collocation' && (
        <span onClick={goBack} className={styles.goBack}>
          <Icon type="arrow-left" />返回
        </span>
      )}
      {props.children}
    </div>
  );
}

export default BasicLayout;
