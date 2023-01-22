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
        option.value = 'src/script/list/' + file;
        option.text = file.replace('.txt','');
        fileSelect.appendChild(option);
      }
    });
  })
  .catch(error => console.log(error));

function measure() {
  const urlFile = fileSelect.value;

  fetch(urlFile)
    .then(response => response.text())
    .then(text => {
      const urls = text.split('\n');
      // 配列から順番にURLを取り出し、非同期で計測
      measureUrl(urls, 0);
    })
    .catch(error => console.log(error));
}

function measureUrl(urls, index) {
  if (index >= urls.length) {
    // 全URLの計測が終了したら、応答時間が短い順に並べ替え
      sortTable();
      return;
    }
    const start = performance.now();
    fetch(urls[index], {mode: 'no-cors'})
      .then(response => {
        const end = performance.now();
        const row = table.insertRow();
        row.insertCell().innerHTML = urls[index];
        row.insertCell().innerHTML = (end - start).toFixed(2);
        // 次のURLを計測
        measureUrl(urls, index + 1);
      })
      .catch(error => console.log(error));
  }

  function sortTable() {
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
  }