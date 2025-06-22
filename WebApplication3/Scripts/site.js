var cont;
// Create header rows
const row_numbers = Array.from({ length: 10 }, (v, i) => i + 1);
const headerRow = document.getElementById('headerRow');

// Create th for table
row_numbers.forEach(number => {
    const th = document.createElement('th');
    th.textContent = number;
    headerRow.appendChild(th);
});

// Drag event
function dragstartHandler(ev) {
    const target = ev.target;
    cont = target.innerText;
    const currentCell = target.closest('td');
    const aboveCell = currentCell.parentNode.previousElementSibling
    && currentCell.parentNode.previousElementSibling.children[currentCell.cellIndex];
    if (aboveCell && aboveCell.innerText.trim() === '' || aboveCell === undefined) {
        ev.dataTransfer.setData("text", target.id);
    } else {
        ev.preventDefault();
    }
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    const table = document.getElementById('myTable');
    const tbody = table.querySelector('tbody');
    const target = ev.target;
    if (target.tagName === 'TD') {
        const row = target.parentNode;
        const lastRow = tbody.rows[table.rows.length - 1];
        const index = Array.from(row.parentNode.children).indexOf(row);
        const colIndex = target.cellIndex;
        const nextRow = tbody.rows[index + 1];
        let cell = "";
        if(nextRow != undefined) {
            cell = nextRow.cells[colIndex];
        }
        let previousCell = "";
        const previousRow = table.rows[index - 1];
        //const previousCell = previousRow.cells[colIndex];
        if(previousRow != undefined) {
            previousCell = previousRow.cells[colIndex];
        }

        if((previousCell.innerText == '' && cell.innerText == '') || (previousCell == '' && cell.innerText == '')) {
            return;
        } else {
            if(cell.innerText != cont ) {
                const data = ev.dataTransfer.getData("text");
                ev.target.appendChild(document.getElementById(data));
                const _this = ev.target;
                const row = _this.getAttribute('data-row');
                const div = this.querySelector('div');
                const dataId = div.getAttribute('data-id');
                // Lấy data-tier từ tr cha
                const tier = _this.closest('tr').getAttribute('data-tier');

                const dataCntr = {
                    'id': dataId,
                    'row': row,
                    'tier': tier
                };
                // Update position of container
                updatePosition(dataCntr);
            }
        }
    }
}

init();
// Add drop event to td
function init() {
    const table = document.getElementById('myTable');
    const tds = table.getElementsByTagName('td');
    for (let td of tds) {
        td.ondragover = dragoverHandler;
        td.ondrop = dropHandler;
    }
}

function updatePosition(data) {
    fetch(`/Depot/updatePosition`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
    })
    .then(data => {
        // Success
    })
    .catch(error => {
        console.error("Error:", error);
    });
}


// Get position of containers
function getPosition(block, bay) {
    fetch(`/Depot/GetContByBay/${block}/${bay}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        tabActive(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Open tab
function openTab(evt, tabName, tabID) {

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    //document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    // Declare all variables
    /*
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
/*
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
*/
    // Get data
    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    getPosition(selectedBlock, tabID);
}

// Click the first tab
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tablinks").click(); // Nhấp vào tab đầu tiên
});

function tabActive(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    const tier = 5;
    const row = 5;

    for (let i = 5; i >= 1; i--) {
        const row = document.createElement('tr');
        row.setAttribute('data-tier', i);
        row_numbers.forEach((val) => {
            const cell = document.createElement('td');
            /*
            cell.setAttribute('data-row', `${val}${i}`);
            const key = `${val}${i}`;
            const item = data[key] && data[key][i];
            */
            cell.setAttribute('data-row', `${val}`);
            const item = data[val] && data[val][i];
            if (item) {
                const div = document.createElement('div');
                div.setAttribute('draggable', 'true');
                div.setAttribute('ondragstart', 'dragstartHandler(event)');
                div.setAttribute('id', item[1]);
                //div.className = 'st-cont tooltip';
                div.className = 'st-cont';
                div.setAttribute('data-id', item[0]);
                if (item[4]) {
                    div.style.backgroundColor = item[4];
                }

                const spanText = document.createElement('span');
                spanText.className = 'text';
                spanText.textContent = item[1];
                /*
                const spanTooltip = document.createElement('span');
                spanTooltip.className = 'tooltiptext';
                spanTooltip.textContent = item[1];
                */
                div.appendChild(spanText);
                //div.appendChild(spanTooltip);
                cell.appendChild(div);
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    }
    // Initial previous events
    init();
    divHover();
}

// Display container when hover
function divHover() {
    const divElements = document.querySelectorAll('td div.st-cont');
    divElements.forEach(div => {
        div.addEventListener('mouseenter', function () {
            const text = this.querySelector('.text').innerText;
            document.getElementById('num-container').innerText = 'Số container: ' + text;
        });

        div.addEventListener('mouseleave', function () {
            document.getElementById('num-container').innerText = '';
        });
    });
}


// Block event
document.getElementById('blockSelect').addEventListener('change', function () {
    const block = this.value;
    console.log(block)
    if (block) {
        // Gọi fetch GET để lấy danh sách bay
        fetch(`/Depot/GetBayByBlock/${block}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Có lỗi xảy ra');
                }
                return response.json();
            })
            .then(data => {
                // Hiển thị danh sách bay
                if (data != '[]') {
                    document.getElementById('tabs').innerHTML = '';
                    // Tạo các tab và nội dung
                    data.forEach(item => {
                        // Tạo nút tab
                        const tabButton = document.createElement('button');
                        tabButton.className = 'tablinks';
                        tabButton.textContent = item.Bay;
                        tabButton.onclick = function (event) {
                            openTab(event, `Tab@bay${item.Id}`, item.Bay);
                        };
                        document.getElementById('tabs').appendChild(tabButton);

                    });

                    // Click the first tab
                    document.querySelector(".tablinks").click();
                }

            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);
            });
    }
});