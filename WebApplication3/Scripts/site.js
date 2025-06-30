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
            console.log(111)
            return;
        } else {
            let data = ev.dataTransfer.getData("text");
            const containsMove = data.includes('truck'); // Kiểm tra có chứa "move || truck"
            if (containsMove) {
                data = data.replace('truck', '');
                const blinkingText = document.createElement('div'); // Tạo một phần tử div mới
                blinkingText.className = 'blinking-text'; // Thêm lớp cho div
                blinkingText.textContent = document.getElementById(data).textContent; // Lấy nội dung từ phần tử khác

                // Thêm phần tử div vào node mục tiêu
                ev.target.appendChild(blinkingText);
                const _this = ev.target;
                const row = _this.getAttribute('data-row');
                const div = this.querySelector('div');
                //const dataId = div.getAttribute('data-id');
                const socont = data;
                // Lấy data-tier từ tr cha
                const tier = _this.closest('tr').getAttribute('data-tier');
                const blockSelect = document.getElementById('blockSelect');
                const selectedBlock = blockSelect.value;
                const activeElement = document.querySelector('.active');
                const activeBay = activeElement.innerText;
                const dataCntr = {
                    //'id': dataId,
                    'block': selectedBlock,
                    'bay': activeBay,
                    'row': row,
                    'tier': tier,
                    'socont': socont
                };
                // Update position of container
                updatePosition(dataCntr);
                document.getElementById(data).parentNode.parentNode.remove();
            }
            //console.log(1112)
            //if(cell.innerText != cont ) {
            else {
                const data = ev.dataTransfer.getData("text");
                ev.target.appendChild(document.getElementById(data));
                const _this = ev.target;
                const row = _this.getAttribute('data-row');
                const div = this.querySelector('div');
                //const dataId = div.getAttribute('data-id');
                const socont = div.getAttribute('data-socont');
                // Lấy data-tier từ tr cha
                const tier = _this.closest('tr').getAttribute('data-tier');

                const dataCntr = {
                    //'id': dataId,
                    'row': row,
                    'tier': tier,
                    'socont': socont
                };
                // Update position of container
                updatePosition(dataCntr);
            }
            

            
            //console.log(data)
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

function updateMovePosition(data) {
    fetch(`/Depot/updateMovePosition`, {
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

function updateTruckPosition(data) {
    fetch(`/Depot/updateTruckPosition`, {
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
                div.setAttribute('data-socont', item[1]);
                if (lineColor[item[4]]) {
                    div.style.backgroundColor = '#' + lineColor[item[4]];
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
                            openTab(event, `Tab@bay${item.Bay}`, item.Bay);
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

setInterval(function () {
    const activeButton = document.querySelector('.tablinks.active');

    if (activeButton) {
        activeButton.click();
    }
}
    , 2000);

// Container
const dropArea = document.getElementById('drop-area');
//const img = document.getElementById('image');

// Ngăn chặn hành động mặc định
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.borderColor = 'green'; // Thay đổi màu viền khi kéo vào
});

// Khôi phục màu viền khi không còn kéo vào
// Xử lý sự kiện drop
dropArea.addEventListener('drop', (ev) => {
    event.preventDefault();
    const data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
    let cont = document.getElementById(data);
    cont.remove();
    console.log(data)
    //dropArea.style.borderColor = '#ccc'; // Khôi phục màu viền
    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    const activeElement = document.querySelector('.active');
 
    const activeBay = activeElement.innerText;
    const dataCntr = {
        //'id': dataId,
        'block': selectedBlock,
        'bay': activeBay,
        'socont': data
    };
    console.log(dataCntr)
    updateMovePosition(dataCntr);
});

// Popup
const myDiv = document.getElementById('queue');
const myPopup = document.getElementById('myPopup');

myDiv.addEventListener('click', function (event) {
    

    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    const activeElement = document.querySelector('.active');

    const activeBay = activeElement.innerText;
    getMoveContainer(selectedBlock, activeBay);


    const rect = myDiv.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //myPopup.style.top = `${y + 100}px`; // Vị trí bên dưới div
    //myPopup.style.right = `${x * 2}px`;
    myPopup.style.display = 'block'; // Hiện popup
});


// Get position of containers
function getMoveContainer(block, bay) {
    fetch(`/Depot/GetMoveContainer/${block}/${bay}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        createTable(data)
        //render(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Get position of containers
function getTruckContainer(block, bay) {
    fetch(`/Depot/GetTruckContainer/${block}/${bay}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        createTruckTable(data)
        //render(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function createTruckTable(data) {
    const tableContainer = document.getElementById('tableTruck');
    tableContainer.innerHTML = '';
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'truck-table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Số cont'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Populate table body
    data.forEach(item => {
        const row = document.createElement('tr');
        console.log(item)

        const div = document.createElement('div');
        div.setAttribute('draggable', 'true');

        // Add dragstart event listener
        div.addEventListener('dragstart', dragstartHandlerTruckCont);

        //div.setAttribute('ondragstart', 'dragstartHandler(event)');
        div.setAttribute('id', item.SoCont.trim());
        //div.className = 'st-cont';
        div.setAttribute('data-id', item.SoCont);
        div.innerText = item.SoCont;
        // If you have another data attribute, uncomment the next line
        // div.setAttribute('data-socont', item[1]);

        const cell = document.createElement('td'); // Create a new table cell
        cell.appendChild(div); // Append the div to the cell

        row.appendChild(cell); // Append the cell to the row

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}


// Function to create and populate the table
function createTable(data) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'move-table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Số cont'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Populate table body
    data.forEach(item => {
        const row = document.createElement('tr');
        console.log(item)
  
        const div = document.createElement('div');
        div.setAttribute('draggable', 'true');

        // Add dragstart event listener
        div.addEventListener('dragstart', dragstartHandlerMoveCont);

        //div.setAttribute('ondragstart', 'dragstartHandler(event)');
        div.setAttribute('id', item.SoCont.trim());
        //div.className = 'st-cont';
        div.setAttribute('data-id', item.SoCont);
        div.innerText = item.SoCont;
        // If you have another data attribute, uncomment the next line
        // div.setAttribute('data-socont', item[1]);

        const cell = document.createElement('td'); // Create a new table cell
        cell.appendChild(div); // Append the div to the cell

        row.appendChild(cell); // Append the cell to the row

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}
// Example dragstartHandler function
function dragstartHandlerMoveCont(event) {

    console.log(event.target.id)
    // Your drag logic here
    event.dataTransfer.setData('text', 'move' + event.target.id); // Set data for the drag event
}

function dragstartHandlerTruckCont(event) {

    //console.log(event.target.id)
    // Your drag logic here
    event.dataTransfer.setData('text', 'truck' + event.target.id); // Set data for the drag event
}

const closePopup = document.getElementById('close');

closePopup.addEventListener('click', function (event) {
    myPopup.style.display = 'none';
})

const closeTruckPopup = document.getElementById('close-truck');

closeTruckPopup.addEventListener('click', function (event) {
    truckPopup.style.display = 'none';
})



const truckArea = document.getElementById('truck-area');
//const img = document.getElementById('image');

// Ngăn chặn hành động mặc định
truckArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.borderColor = 'green'; // Thay đổi màu viền khi kéo vào
});

truckArea.addEventListener('drop', (ev) => {
    event.preventDefault();
    let data = ev.dataTransfer.getData("text");
    const containsMove = data.includes('move'); // Kiểm tra có chứa "move || truck"
    let isMove = false;
    if (containsMove) {
        data = data.replace('move', '');
        isMove = true;
    }
    //ev.target.appendChild(document.getElementById(data));
    //let cont = document.getElementById(data);
    //cont.remove();
    if (isMove) {
        document.getElementById(data).parentNode.parentNode.remove();
    } else {
        document.getElementById(data).remove();
    }
    
    //dropArea.style.borderColor = '#ccc'; // Khôi phục màu viền
    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    const activeElement = document.querySelector('.active');

    const activeBay = activeElement.innerText;
    const dataCntr = {
        //'id': dataId,
        'block': selectedBlock,
        'bay': activeBay,
        'socont': data
    };
    updateTruckPosition(dataCntr);
});


// Truck popup
// Popup
const truckDiv = document.getElementById('truck');
const truckPopup = document.getElementById('truckPopup');

truckDiv.addEventListener('click', function (event) {
    

    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    const activeElement = document.querySelector('.active');

    const activeBay = activeElement.innerText;
    getTruckContainer(selectedBlock, activeBay);


    const rect = myDiv.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //myPopup.style.top = `${y + 100}px`; // Vị trí bên dưới div
    //myPopup.style.right = `${x * 2}px`;
    truckPopup.style.display = 'block'; // Hiện popup
});
