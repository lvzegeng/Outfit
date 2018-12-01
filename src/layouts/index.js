import router from 'umi/router';
import styles from './index.css';

function BasicLayout(props) {
  const { pathname } = props.location;
  const goBack = () => {
    router.goBack();
  };
  return (
    <div>
      {pathname !== '/collocation' && <div onClick={goBack}>返回</div>}
      {props.children}
    </div>
  );
}

export default BasicLayout;
