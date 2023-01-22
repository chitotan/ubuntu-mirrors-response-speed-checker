const table = document.getElementById('result-table');
const fileSelect = document.getElementById('file-select');

// ディレクトリ内のtxtファイルを検索し、select要素に追加
fetch('src/script/list/list.php')
.then(response => response.text())
.then(text => {
  const files = text.split('\n');
  files.forEach(file => {
    if(file.endsWith('.txt')){
      const option = document.createElement('option');
      option.value = file;
      option.text = file.replace('.txt',''); // 拡張子を除去
      fileSelect.appendChild(option);
    }
  });
})
.catch(error => console.log(error));

function measure() {
  const urlFile = 'src/script/list/' + fileSelect.value;

  fetch(urlFile)
    .then(response => response.text())
    .then(text => {
      const urls = text.split('\n');
      urls.forEach(url => {
        const start = performance.now();
        fetch(url, {mode: 'no-cors'})
          .then(response => {
            const end = performance.now();
            const row = table.insertRow();
            row.insertCell().innerHTML = url;
            row.insertCell().innerHTML = (end - start).toFixed(2);
          })
          .catch(error => console.log(error));
      });
    })
    .then(() => {
        let rows, switching, i, x, y, shouldSwitch;
        switching = true;
        while (switching) {
          switching = false;
          rows = table.rows;
          for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
          }
        }
      })
      .catch(error => console.log(error));
  }