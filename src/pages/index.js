import styles from './index.css';
import Redirect from 'umi/redirect';

export default function() {
  return (
    <div className={styles.normal}>
      <Redirect to="/collocation" />
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
          To get started, edit <code>src/pages/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">Getting Started</a>
        </li>
      </ul>
    </div>
  );
}
