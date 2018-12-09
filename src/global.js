const { shell } = require('electron');
import path from 'path';

document.body.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('http')) {
      e.preventDefault();
      // 以桌面的默认方式打开给定的外部协议URL
      shell.openExternal(href);
    } else if (path.isAbsolute(href)) {
      e.preventDefault();
      if (e.target.getAttribute('target') === '_self') {
        // 以桌面的默认方式打开给定的文件
        shell.openItem(href);
      } else {
        // 在文件管理器中显示给定的文件
        shell.showItemInFolder(href);
      }
    }
  }
});
