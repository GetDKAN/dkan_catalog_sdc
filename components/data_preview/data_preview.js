// async function logMovies() {
//   const response = await fetch("/");
//   const moves = await response.json();
//   console.log(movies);
// }
// https://openpaymentsdata.cms.gov/api/1/datastore/query/66dfcf9a-2a9e-54b7-a0fe-cae3e42f3e8f?keys=true&limit=50&offset=0
// logMovies()

function createTableHeader(tableID, properties) {
  let table = document.getElementById(tableID);//"tableId"
  let header = table.createTHead(table);
  let row = header.insertRow(0);

  let head = properties; //moves.query.properties
  for (let i = 0; i < head.length; i++) {
    let cell = document.createElement("th");
    cell.innerText = head[i];
    row.append(cell);
  }
}

function populateTableBody(tableID, properties, results) {
  let table = document.getElementById(tableID);
  let tbody = table.createTBody(table);
  for (let i = 0; i < results.length; i++) {
    let row = tbody.insertRow(i);
    properties.forEach(function(key) {
      let cell = document.createElement("td");
      cell.innerText = results[i][key];
      row.append(cell);
    })
  }
}

function resizableGrid(tableID) {
  const table = document.getElementById(tableID);

  let row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined;
  if (!cols) return;

  table.style.overflow = 'hidden';

  for (var i = 0; i < cols.length; i++) {
    let resizeHandle = createDiv();
    cols[i].appendChild(resizeHandle);
    cols[i].style.position = 'relative';
    setListeners(resizeHandle);
  }

  function setListeners(resizeHandle) {
    var pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

    resizeHandle.addEventListener('mousedown', function(e) { 
    
      tableWidth = document.getElementById(tableID).offsetWidth;
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX;

      var padding = paddingDiff(curCol);

      curColWidth = curCol.offsetWidth - padding;
     if (nxtCol)
        nxtColWidth = nxtCol.offsetWidth - padding;
    });

    resizeHandle.addEventListener('mouseover', function(e) {
      e.target.classList.add('dkan-sdc-resize-handle--hovered');
    })

    resizeHandle.addEventListener('mouseout', function(e) {
      e.target.classList.remove('dkan-sdc-resize-handle--hovered');
    })

    document.addEventListener('mousemove', function(e) {
      if (curCol) {
        var diffX = e.pageX - pageX;

        if (nxtCol)
            nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

        curCol.style.width = (curColWidth + diffX) + 'px';
        document.getElementById(tableID).style.width = tableWidth + diffX + "px"
      }
    });

    document.addEventListener('mouseup', function(e) {
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined
    });
  }

  function createDiv() {
    const span = document.createElement('span');
    span.classList.add('dkan-sdc-resize-handle')
    return span;
  }

  function paddingDiff(col) {

    if (getStyleVal(col, 'box-sizing') == 'border-box') {
      return 0;
    }

    const padLeft = getStyleVal(col, 'padding-left');
    const padRight = getStyleVal(col, 'padding-right');
    return (parseInt(padLeft) + parseInt(padRight));

  }

  function getStyleVal(elm, css) {
    return (window.getComputedStyle(elm, null).getPropertyValue(css))
  }
};

function createDataPreview(tableID, properties, results) {
  createTableHeader(tableID, properties);
  populateTableBody(tableID, properties, results);
  resizableGrid(tableID);
}


function updateResultsCount(id, offset, limit, count) {
  const resultsContainer = document.getElementById(id);
  resultsContainer.innerHTML = 'Displaying ' + (offset + 1).toLocaleString() + ' - ' +  limit.toLocaleString() + ' of ' +  count.toLocaleString() + ' results'
}

(function (Drupal, once) {
  Drupal.behaviors.data_preview = {
    attach: function attach(context) {
      const distributions = once(
        'component--data-preview',
        '[data-component-id="dkan_catalog_sdc:data_preview"]',
        context,
      );

      distributions.forEach((dist) => {
        // Get the dataset id and distribution index for the API request.
        const index = dist.getAttribute('distribution_index');
        const id = dist.getAttribute('dataset_id');
        const tableID = id + '-' + index;
        const resultsCountID = id + '-' + index + '-results';
        async function requestAndBuildDataPreviews() {
          // TODO: Get limit and offset in way that allows pagination or setting new limits.
          const response = await fetch('/api/1/datastore/query/' + id + "/" + index + '?keys=true&limit=50&offset=0');
          const jsonData = await response.json();
          const properties = jsonData.query.properties;
          const results = jsonData.results;
          const count = jsonData.count;
          createDataPreview(tableID, properties, results);
          updateResultsCount(resultsCountID, 0, 50, count)
        }
        requestAndBuildDataPreviews();
      });

      




    },
  };
})(Drupal, once);






