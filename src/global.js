const { shell } = require('electron');
import path from 'path';

document.body.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('http')) {
      e.preventDefault();
      shell.openExternal(href);
    } else if (path.isAbsolute(href)) {
      e.preventDefault();
      if (e.target.getAttribute('target') === '_self') {
        shell.openExternal(`file://${href}`);
      } else {
        shell.showItemInFolder(href);
      }
    }
  }
});
