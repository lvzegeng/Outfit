import router from 'umi/router';
const { shell } = require('electron');
import { Icon } from 'antd';
import styles from './index.css';

document.body.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('http')) {
      e.preventDefault();
      shell.openExternal(href);
    }
  }
});

function BasicLayout(props) {
  const { pathname } = props.location;
  const goBack = () => {
    router.goBack();
  };
  return (
    <div>
      {pathname !== '/collocation' && (
        <div onClick={goBack} className={styles.goBack}>
          <Icon type="arrow-left" />返回
        </div>
      )}
      {props.children}
    </div>
  );
}

export default BasicLayout;
