var cont;
// Create header rows
const row_numbers = Array.from({ length: 10 }, (v, i) => i + 1);
const headerRow = document.getElementById('headerRow');

// Create th for table
row_numbers.forEach(number => {
    /*
    const th = document.createElement('th');
    th.textContent = number;
    headerRow.appendChild(th);
    */
});


// Drag event
function dragstartHandler(ev) {
    const target = ev.target;
    cont = target.innerText;
    const currentCell = target.closest('td');
    const aboveCell = currentCell.parentNode.previousElementSibling
    && currentCell.parentNode.previousElementSibling.children[currentCell.cellIndex];

    localStorage.setItem('item', currentCell.innerText)
    //console.log(currentCell.parentNode.previousElementSibling)
    if (aboveCell && aboveCell.innerText.trim() === '' || aboveCell === undefined || aboveCell == null) {
        ev.dataTransfer.setData("text", target.id);
    } else {
        ev.preventDefault();
    }
   
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    // Lấy tọa độ chuột
    const dropX = ev.clientX;
    //console.log(dropX)
    //console.log(ev.target.getBoundingClientRect());
    //return;
    const xTd = (ev.target.getBoundingClientRect()).x + 25;

    let position = '';

    ev.preventDefault();
    const table = document.getElementById('myTable');
    const tbody = table.querySelector('tbody');
    const target = ev.target;
    if (target.tagName === 'TD') {
        const row = target.parentNode;
        const lastRow = tbody.rows[table.rows.length - 1];
        const index = Array.from(row.parentNode.children).indexOf(row);
        const colIndex = target.cellIndex;
        let side = '';
        //return;
        const nextRow = tbody.rows[index + 1];
        let cell = "";
        if(nextRow != undefined) {
            cell = nextRow.cells[colIndex];
        }
        let previousCell = "";
        const previousRow = table.rows[index - 1];
        if(previousRow != undefined) {
            previousCell = previousRow.cells[colIndex];
        }
        // Not last row, cont-4 move onto cont-2
        if (cell && cell.getElementsByTagName('div').length == 1) {
            

            //console.log(cell)
            let nextCellInfo = cell.getElementsByTagName('div');

            let nextSizeCell = ((cell.getElementsByTagName('div'))[0]).getAttribute('data-size');
            let currentContainer = ev.dataTransfer.getData("text");

            let currentInfo = document.getElementById(currentContainer);
            if (currentContainer.includes('truck')) {
                currentInfo = document.getElementById(currentContainer.replace('truck', ''));
            }

            if (currentContainer.includes('move')) {
                currentInfo = document.getElementById(currentContainer.replace('move', ''));
            }
            
            const currentSize = currentInfo.getAttribute('data-size');

            if (nextCellInfo.length == 1 && nextSizeCell[1] == '2' && currentSize[1] != '2') {
                return;
            }

            // If below is cont2 and the current one is cont2, then skip
            let currentCell = tbody.rows[index].cells[colIndex];
            let currentCellInfo = currentCell.getElementsByTagName('div');
            if (nextCellInfo.length == 1 && nextSizeCell[1] == '2' && currentCellInfo.length == 1) {
                return;
            }
        }
        //return;
        // Empty td

        if (!cell) {
            let currentContainer = ev.dataTransfer.getData("text");
            let currentInfo = document.getElementById(currentContainer);
            if (currentContainer.includes('truck')) {
                currentInfo = document.getElementById(currentContainer.replace('truck', ''));
            }
            if (currentContainer.includes('move')) {
                currentInfo = document.getElementById(currentContainer.replace('move', ''));
            }
            const currentSize = currentInfo.getAttribute('data-size');

            let currentCell = tbody.rows[index].cells[colIndex];
            if( (currentCell.getElementsByTagName('div').length > 1 )) {
                let currentSizeCell = ((currentCell.getElementsByTagName('div'))[0]).getAttribute('data-size');

                if (currentCell.length == 1 && currentSizeCell[1] == '2' && currentSize[1] != '2') {
                    return;
                }
            }
            
        }

        // Cont-4 move into cont-2
        let currentCell = tbody.rows[index].cells[colIndex];
        //console.log(currentCell.getElementsByTagName('div').length);
        //return;
        let currentCellId = '';
        if ((currentCell.getElementsByTagName('div').length == 1)) {
            
            let currentContainer = ev.dataTransfer.getData("text");
            currentCellId = ((currentCell.getElementsByTagName('div'))[0]).getAttribute('id');
            console.log('Day la'+currentCellId)
            let currentInfo = document.getElementById(currentContainer);
            if (currentContainer.includes('truck')) {
                currentInfo = document.getElementById(currentContainer.replace('truck', ''));
            }
            if (currentContainer.includes('move')) {
                currentInfo = document.getElementById(currentContainer.replace('move', ''));
            }
            const currentSize = currentInfo.getAttribute('data-size');
            //console.log((currentCell.getElementsByTagName('div'))[0])
            let currentSizeCell = ((currentCell.getElementsByTagName('div'))[0]).getAttribute('data-size');

            if (currentSizeCell[1] == '2' && currentSize[1] != '2') {
                return;
            }

        }
        let current = tbody.rows[index].cells[colIndex];
        //console.log('Cell' + cell.innerText)
        if (localStorage.getItem('item') == cell.innerText) {
            console.log('Invalid')
            return;
        }
        
        if ((previousCell.innerText == '' && cell.innerText == '') || (previousCell == '' && cell.innerText == '') || (previousCell.innerText == '' && cell.innerText == '')) {
            return;
        } else {
            let data = ev.dataTransfer.getData("text");
            const containsMove = data.includes('move'); // Kiểm tra có chứa "move || truck"
            const containsTruck = data.includes('truck');
            if (containsMove || containsTruck) {
                data = data.replace('truck', '');
                if (containsMove) {
                    data = data.replace('move', '');
                }
                const blinkingText = document.createElement('div'); // Tạo một phần tử div mới
                blinkingText.className = 'blinking-text st-cont'; // Thêm lớp cho div
                blinkingText.textContent = document.getElementById(data).textContent; // Lấy nội dung từ phần tử khác

                // Thêm phần tử div vào node mục tiêu
                //ev.target.appendChild(blinkingText);
                const _this = ev.target;
                console.log(_this.getElementsByTagName('div').length)
                if ((_this.getElementsByTagName('div')).length == 1) {
                    console.log('Vi tri'+dropX)
                    if (checkSideCont(currentCellId, dropX) == 'right') {
                        const firstChild = (ev.target).firstChild;
                        ev.target.insertBefore(blinkingText, firstChild);
                        position = 'left';
                    } else {
                        //ev.target.appendChild(document.getElementById(data));
                        ev.target.appendChild(blinkingText);
                        position = 'right';
                    }
                } else if ((_this.getElementsByTagName('div')).length == 0)  {
              
                    ev.target.appendChild(blinkingText);
                    if (dropX < xTd) {
                        position = 'left';
                    } else {
                        position = 'right';
                    }
                    //ev.target.appendChild(document.getElementById(data));
                }

                const row = _this.getAttribute('data-row');
                const div = this.querySelector('div');
                //const dataId = div.getAttribute('data-id');

                const socont = data;
                // Lấy data-tier từ tr cha
                const tier = _this.closest('tr').getAttribute('data-tier');
                const blockSelect = document.getElementById('blockSelect');
                const selectedBlock = blockSelect.value;
                const activeElement = document.querySelector('.active');
                let activeBay = activeElement.innerText;
                if (activeBay[1] == 0) {
                    activeBay = activeBay[0] + activeBay[2];
                }
                const dataCntr = {
                    //'id': dataId,
                    'block': selectedBlock,
                    'bay': activeBay,
                    'row': row,
                    'tier': tier,
                    'socont': socont,
                    'position': position
                };
                // Update position of container
                updatePosition(dataCntr);
                document.getElementById(data).parentNode.parentNode.remove();
            }
            //if(cell.innerText != cont ) {
            else {
                const data = ev.dataTransfer.getData("text");
                //const offsetX = ev.clientX;

                /*
                const dropzoneRect = (ev.target).getBoundingClientRect();
                const offsetX = event.clientX - dropzoneRect.left;

                //console.log(dropzoneRect, offsetX)
                if (offsetX < dropzoneRect.width / 2) {
                    const firstChild = (ev.target).firstChild;
                    ev.target.insertBefore(document.getElementById(data), firstChild)
                } else {
                    ev.target.appendChild(document.getElementById(data));
                }
                */

               
                const _this = ev.target;
                if ((_this.getElementsByTagName('div')).length == 1) {
                    /*
                    if (checkSideCont(currentCellId, dropX) == 'right') {
                        const firstChild = (ev.target).firstChild;
                        ev.target.insertBefore(document.getElementById(data), firstChild);
                        position = 'left';
                    } else {
                        ev.target.appendChild(document.getElementById(data));
                        position = 'right';
                        */
                    if (dropX < xTd) {
                        const firstChild = (ev.target).firstChild;
                        let obj = document.getElementById(data);
                        obj.style.float = 'left';
                        ev.target.insertBefore(obj, firstChild);
                        position = 'left';
                    } else {
                        let obj = document.getElementById(data);
                        obj.style.float = 'right';
                        ev.target.appendChild(obj);
                        position = 'right';
                    }
                  
                } else if ((_this.getElementsByTagName('div')).length == 0)  {
                    
                    //ev.target.appendChild(blinkingText);
                    if (dropX < xTd) {
                        const firstChild = (ev.target).firstChild;
                        //console.log(firstChild)
                        let obj = document.getElementById(data);
                        obj.style.float = 'left';
                        ev.target.insertBefore(obj, firstChild);
                        position = 'left';
                    } else {
                        let obj = document.getElementById(data);
                        obj.style.float = 'right';
                        ev.target.appendChild(obj);
                        position = 'right';
                    }
                }
                if ((document.getElementById(data).getAttribute('data-size'))[0] == '2') {
                    ev.target.style.minWidth = '104px';
                    //cell.style.backgroundColor = 'grey';
                    //cell.style.textAlign = 'left'
                }
                
                // Find cont
                const row = _this.getAttribute('data-row');
                let socont = '';
                // Find cont
                if ((_this.getElementsByTagName('div')).length == 2) {
                    let div = _this.getElementsByTagName('div')[0];
                    socont = div.getAttribute('data-socont');
                    if (position == 'right') {
                        const div = _this.getElementsByTagName('div')[1];
                        socont = div.getAttribute('data-socont');
                    } 
                    
                } else {
                    const div = this.querySelector('div');
                    //const dataId = div.getAttribute('data-id');
                    socont = div.getAttribute('data-socont');
                }

                // Lấy data-tier từ tr cha
                const tier = _this.closest('tr').getAttribute('data-tier');
                const dataCntr = {
                    //'id': dataId,
                    'row': row,
                    'tier': tier,
                    'socont': socont,
                    'position' : position
                };
                // Update position of container
                updatePosition(dataCntr);
            }
            
        }
    } else {
        console.log(4)
    }
}

init();
// Add drop event to td
function init() {
    const table = document.getElementById('myTable');
    const tds = table.getElementsByTagName('td');
    for (let td of tds) {
        td.ondragover = dragoverHandler;
        td.ondrop = dropHandler
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
        tabActive2(data);
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
                div.setAttribute('data-size', item[5]);
                div.setAttribute('data-line', item[4]);
                if (lineColor[item[4]]) {
                    div.style.backgroundColor = '#' + lineColor[item[4]];
                }
                if (item[5][1] != '2') {
                    div.style.width = '';
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
        //return;
        tableBody.appendChild(row);
    }
    // Initial previous events
    init();
    divHover();
}

function removeWhitespace(str) {
    return str.trim(); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
}
let currentDraggedElement = null;

function touchStartHandler(ev) {
    const touch = ev.touches[0];
    const img = ev.target;
    img.dataset.startX = touch.clientX - img.offsetLeft; // Tính toán vị trí bắt đầu
    img.dataset.startY = touch.clientY - img.offsetTop;


    currentHoldingCell = ev.target.closest('td');
    if (currentHoldingCell) {
        const row = currentHoldingCell.parentNode;
        let aboveCell = row.previousElementSibling ? row.previousElementSibling.children[currentHoldingCell.cellIndex] : null;
        let belowCell = row.nextElementSibling ? row.nextElementSibling.children[currentHoldingCell.cellIndex] : null;

        if (aboveCell && aboveCell.innerHTML != '' && belowCell != '') {
            return;
        }
        // else
        img.style.opacity = '0.5'; // Giảm độ trong suốt khi kéo
        currentDraggedElement = img; // Lưu phần tử đang kéo
        localStorage.setItem('item', currentDraggedElement.innerText)
    }
}

function touchMoveHandler(ev) {
    //const touchY = e.touches[0].clientY;

    //const dropTarget = document.elementFromPoint(e.changedTouches[0].clientX, touchY);
    //console.log(dropTarget)

    if (!currentDraggedElement) return; // Nếu không có phần tử nào đang được kéo
    const touch = ev.touches[0];
}

// Move handler
function touchStartHandlerMove(ev) {
    const touch = ev.touches[0];
    const img = ev.target;
    img.dataset.startX = touch.clientX - img.offsetLeft; // Tính toán vị trí bắt đầu
    img.dataset.startY = touch.clientY - img.offsetTop;
    img.style.opacity = '0.5'; // Giảm độ trong suốt khi kéo
    currentDraggedElement = img; // Lưu phần tử đang kéo
}

function touchMoveHandlerMove(ev) {
    if (!currentDraggedElement) return; // Nếu không có phần tử nào đang được kéo
    const touch = ev.touches[0];
}

// Move handler
function touchStartHandlerTruck(ev) {
    const touch = ev.touches[0];
    const img = ev.target;
    img.dataset.startX = touch.clientX - img.offsetLeft; // Tính toán vị trí bắt đầu
    img.dataset.startY = touch.clientY - img.offsetTop;
    img.style.opacity = '0.5'; // Giảm độ trong suốt khi kéo
    currentDraggedElement = img; // Lưu phần tử đang kéo
}

function touchMoveHandlerTruck(ev) {
    if (!currentDraggedElement) return; // Nếu không có phần tử nào đang được kéo
    const touch = ev.touches[0];
}

function touchEndHandlerMove(ev) {
    // Kiểm tra vị trí thả và gọi dropHandler
    const dropTarget = document.elementFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);

    const socont = currentDraggedElement.getAttribute('data-id').trim();
    //console.log('234')
    //return;
    if (dropTarget.getAttribute('id') == 'truck') {
        //console.log(dropTarget.getAttribute('id'))
        //(document.getElementById(socont)).closest('tr').remove();
        //console.log(document.getElementById(socont))
        //dropTarget.appendChild(currentDraggedElement);
        let tr = document.getElementById(socont).closest('tr');
        //console.log(tr)
        //currentDraggedElement = null;
        if (tr.remove()) {
            currentDraggedElement = null;
        }
        //return;
        const blockSelect = document.getElementById('blockSelect');
        const selectedBlock = blockSelect.value;
        const activeElement = document.querySelector('.active');

        let activeBay = activeElement.innerText;
        if (activeBay[1] == 0) {
            activeBay = activeBay[0] + activeBay[2];
        }

        const dataCntr = {
            //'id': dataId,
            'block': selectedBlock,
            'bay': activeBay,
            'socont': socont
        };
        //console.log(dataCntr)
        updateTruckPosition(dataCntr);
        return;
    }
}

function touchEndHandlerTruck(ev) {
    // Kiểm tra vị trí thả và gọi dropHandler
    const dropTarget = document.elementFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);

    const socont = currentDraggedElement.getAttribute('data-id');
    console.log('123')
    //return;
    if (dropTarget.getAttribute('id') == 'truck') {
        //console.log(dropTarget.getAttribute('id'))
        //(document.getElementById(socont)).closest('tr').remove();
        //console.log(document.getElementById(socont))
        //dropTarget.appendChild(currentDraggedElement);
        let tr = document.getElementById(socont).closest('tr');
        //console.log(tr)
        //currentDraggedElement = null;
        if (tr.remove()) {
            currentDraggedElement = null;
        }
        //return;
        const blockSelect = document.getElementById('blockSelect');
        const selectedBlock = blockSelect.value;
        const activeElement = document.querySelector('.active');

        let activeBay = activeElement.innerText;
        if (activeBay[1] == 0) {
            activeBay = activeBay[0] + activeBay[2];
        }

        const dataCntr = {
            //'id': dataId,
            'block': selectedBlock,
            'bay': activeBay,
            'socont': socont
        };
        //console.log(dataCntr)
        updateTruckPosition(dataCntr);
        return;
    }
}


function touchEndHandler(ev) {
    // Lấy tọa độ chuột
    const touch = ev.changedTouches[0]; // Lấy touch đầu tiên
    const dropX = touch.clientX; // Lấy tọa độ X
    

    //const dropTarget = document.elementFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
    //console.log(dropTarget.getBoundingClientRect());
    //console.log(ev)
    //const touch = ev.changedTouches[0];
    //const dropX = touch.clientX;
    const dropY = touch.clientY;
    //const dropTarget = document.elementFromPoint(dropX, dropY);
    // Lấy phần tử tại tọa độ đó
    const dropTarget1 = document.elementFromPoint(dropX, dropY);
    const rect = dropTarget1.getBoundingClientRect();
                const xTd = rect.left + 25;
    //console.log(dropX, left);


    //return;
    //const xTd = (ev.target.getBoundingClientRect()).x + 25;

    let position = '';


    // Kiểm tra vị trí thả và gọi dropHandler
    const dropTarget = document.elementFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
       //console.log(dropTarget)

    const aboveCell = dropTarget.parentNode.previousElementSibling
    && dropTarget.parentNode.previousElementSibling.children[dropTarget.cellIndex];

    const belowCell = dropTarget.parentNode.nextElementSibling
    && dropTarget.parentNode.nextElementSibling.children[dropTarget.cellIndex];

    //console.log(dropTarget.closest('td').querySelectorAll('div').length)
    //return;
    if ((dropTarget.closest('td').querySelectorAll('div')).length = 1) {
        const existDiv = dropTarget.closest('td').querySelectorAll('div');
        //console.log(existDiv)
        if ((currentDraggedElement.getAttribute('data-size'))[0] != 2 && existDiv.length > 0 && (existDiv[0].getAttribute('data-size'))[0] == 2) {
            currentDraggedElement.style.opacity = '1';
            return;
        }
        if (existDiv.length > 0 && (existDiv[0].getAttribute('data-size'))[0] != 2) {
            currentDraggedElement.style.opacity = '1';
            return;
        }
    }

    if ((dropTarget.closest('td').querySelectorAll('div')).length == 0 && belowCell != undefined) {
        //console.log('123');
        //return;
        let existDiv = belowCell.querySelectorAll('div');
        if (existDiv.length == 1 && (existDiv[0].getAttribute('data-size'))[0] == 2 && (currentDraggedElement.getAttribute('data-size'))[0] != 2) {
            currentDraggedElement.style.opacity = '1';
            return;
        }
    }

    //console.log(aboveCell)
    //localStorage.setItem('item', currentCell.innerText)
    //console.log(aboveCell.innerText.trim(), belowCell.innerText.trim());

    // If above and below cell are empty
    if (aboveCell && aboveCell.innerText.trim() == '' && belowCell && belowCell.innerText.trim() == '') {
        currentDraggedElement.style.opacity = '1';
        return;
    }

    if (belowCell && belowCell.innerText.trim() == '') {
        currentDraggedElement.style.opacity = '1';
        return;
    }

    if (belowCell && localStorage.getItem('item') == belowCell.innerText.trim()) {
        currentDraggedElement.style.opacity = '1';
        return;
    }


    const socont = currentDraggedElement.getAttribute('data-socont');
   
    if (dropTarget.classList[1] == 'body-content') {
        currentDraggedElement.style.opacity = '1';
        return;
    }
    
    if (dropTarget.getAttribute('id') == 'truck') {
        console.log(dropTarget.getAttribute('id'))
        dropTarget.appendChild(currentDraggedElement);
        currentDraggedElement = null;

        const blockSelect = document.getElementById('blockSelect');
        const selectedBlock = blockSelect.value;
        const activeElement = document.querySelector('.active');

        let activeBay = activeElement.innerText;
        if (activeBay[1] == 0) {
            activeBay = activeBay[0] + activeBay[2];
        }

        const dataCntr = {
            //'id': dataId,
            'block': selectedBlock,
            'bay': activeBay,
            'socont': socont
        };
        //console.log(dataCntr)
        updateTruckPosition(dataCntr);
        return;
    }

    if (dropTarget.getAttribute('id') == 'queue') {
        dropTarget.appendChild(currentDraggedElement);
        currentDraggedElement = null;

        const blockSelect = document.getElementById('blockSelect');
        const selectedBlock = blockSelect.value;
        const activeElement = document.querySelector('.active');

        let activeBay = activeElement.innerText;
        if (activeBay[1] == 0) {
            activeBay = activeBay[0] + activeBay[2];
        }

        const dataCntr = {
            //'id': dataId,
            'block': selectedBlock,
            'bay': activeBay,
            'socont': socont
        };
        //console.log(dataCntr)
        updateMovePosition(dataCntr);
        return;
    }
    //console.log(dropTarget.closest('table').getAttribute('id'))
    if (dropTarget.closest('table').getAttribute('id') == 'myTable') {
        //console.log('123')
        if (socont == null) {
            //console.log(dropTarget)
            let socontbyId = currentDraggedElement.getAttribute('data-id').trim();
            dropTarget.innerText = (socontbyId); // Append phần tử vào ô
            currentDraggedElement.style.opacity = '1'; // Khôi phục độ trong suốt
            //console.log(socontbyId)
            //currentDraggedElement = null; // Reset phần tử đang kéo
            let tr = document.getElementById(socontbyId).closest('tr');
            console.log(tr)
            //currentDraggedElement = null;
            if (tr.remove()) {
                currentDraggedElement = null;
            }
            const row = dropTarget.getAttribute('data-row');
            //socont = div.getAttribute('data-socont');
            const tier = dropTarget.closest('tr').getAttribute('data-tier');

            const blockSelect = document.getElementById('blockSelect');
            const selectedBlock = blockSelect.value;
            const activeElement = document.querySelector('.active');
            let activeBay = activeElement.innerText;
            if (activeBay[1] == 0) {
                activeBay = activeBay[0] + activeBay[2];
            }
            if (dropX < xTd) {
                position = 'left';
            } else {
                position = 'right';
            }
            const dataCntr = {
                //'id': dataId,
                'block': selectedBlock,
                'bay': activeBay,
                'row': row,
                'tier': tier,
                'socont': socontbyId,
                'position': position
            };
            // Update position of container
            updatePosition(dataCntr);
            return;
        }
        //const dropTr = dropTarget.closest('tr');
        //console.log(socont)

        
        dropTarget.appendChild(currentDraggedElement); // Append phần tử vào ô
        currentDraggedElement.style.opacity = '1'; // Khôi phục độ trong suốt
        
        currentDraggedElement = null; // Reset phần tử đang kéo

        const row = dropTarget.getAttribute('data-row');
        //socont = div.getAttribute('data-socont');
        const tier = dropTarget.closest('tr').getAttribute('data-tier');
        if (dropX < xTd) {
            position = 'left';
        } else {
            position = 'right';
        }
        const dataCntr = {
            //'id': dataId,
            'row': row,
            'tier': tier,
            'socont': socont,
            'position': position
        };
        console.log(dataCntr)
        // Update position of container
        updatePosition(dataCntr);
    }
}

function tabActive2(data) {
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
            //const item = data[val] && data[val][i];
            //const item = ;
            //console.log(data[val])
            if (data.length == 0) return;
            data.forEach(item => {
                
                //row[0], // null
                   // removeWhitespace(row[1]),
                if(removeWhitespace(item[2]) == val && removeWhitespace(item[3]) == i) {
                    const div = document.createElement('div');
                    div.setAttribute('draggable', 'true');
                    div.setAttribute('ondragstart', 'dragstartHandler(event)');

                    div.addEventListener('touchstart', touchStartHandler);
                    div.addEventListener('touchmove', touchMoveHandler);
                    div.addEventListener('touchend', touchEndHandler);


                    div.setAttribute('id', item[1]);

                    div.className = 'st-cont';
                    div.setAttribute('data-id', item[0]);
                    div.setAttribute('data-socont', item[1]);
                    div.setAttribute('data-size', item[5]);
                    div.setAttribute('data-line', item[4]);
                    div.setAttribute('data-position', item[6]);
                    if (lineColor[item[4]]) {
                        div.style.backgroundColor = '#' + lineColor[item[4]];
                    }
                    if (item[5][1] != '2') {
                        div.style.width = '';
                    }

                    const spanText = document.createElement('span');
                    spanText.className = 'text';
                    spanText.textContent = item[1];
                    div.appendChild(spanText);

                    cell.appendChild(div);
                    const divs = (cell.getElementsByTagName('div'));
                    //console.log(divs.length)
                    if (item[5][0] == '2' && divs.length == 1) {
                        cell.style.minWidth = '104px';
                        //cell.style.backgroundColor = 'grey';
                        //cell.style.textAlign = 'left'
                        div.classList.add('align-div');
                        cell.style = '';
                        cell.style.minWidth = '104px';
                        cell.style.position = 'relative';
                        div.style.float = div.getAttribute('data-position');
                    }
                    if (item[5][0] == '2' && divs.length == 2) {
                        Array.from(divs).forEach((div, index) => {
                            //div.style.width = '50px';
                            //div.style.textOverflow = 'ellipsis';
                            //console.log(div.getAttribute('data-position'))
                            div.classList.add('align-div');
                            cell.style = '';
                            cell.style.position = 'relative';
                            /*
                            console.log('Vi tri' + div.getAttribute('data-position'))
                            if (div.getAttribute('data-position') == 'right') {
                                div.style.float = 'right';
                            } else {
                                div.style.float = 'left';
                            }
                            */
                            div.style.float = div.getAttribute('data-position');

                        });
                    }
                }
                
                    //row[4],
                    //removeWhitespace(row[5]);

            });
            
            

            if (i == '12345') {
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
                if (item[5][1] != '2') {
                    div.style.width = '';
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
        //return;
        tableBody.appendChild(row);
    }
    // Initial previous events
    init();
    divHover();
    checkMediaQuery();
}

// Display container when hover
function divHover() {
    const divElements = document.querySelectorAll('td div.st-cont');
    divElements.forEach(div => {
        div.addEventListener('mouseenter', function () {
            const text = this.querySelector('.text').innerText;
            const size = this.getAttribute('data-size');
            const line = this.getAttribute('data-line');
            document.getElementById('num-container').innerText = 'Số container: ' + text + ' / ' + size + ' / ' + line;
        });
        
        div.addEventListener('mouseleave', function () {
            document.getElementById('num-container').innerText = '';
        });
    });
}


// Block event
document.getElementById('blockSelect').addEventListener('change', function () {
    const block = this.value;
    //console.log(block)
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
                        tabButton.textContent = (item.Bay).length > 2 ? item.Bay : item.Bay[0] + '0' + item.Bay[1];
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

setInterval(function () {
    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    const activeElement = document.querySelector('.active');

    let activeBay = activeElement.innerText;
    if (activeBay[1] == 0) {
        activeBay = activeBay[0] + activeBay[2];
    }
    getMoveContainer(selectedBlock, activeBay);
    getTruckContainer(selectedBlock, activeBay);

}, 2000);

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
    //console.log(data)
    //dropArea.style.borderColor = '#ccc'; // Khôi phục màu viền
    const blockSelect = document.getElementById('blockSelect');
    const selectedBlock = blockSelect.value;
    const activeElement = document.querySelector('.active');
 
    let activeBay = activeElement.innerText;
    if (activeBay[1] == 0) {
        activeBay = activeBay[0] + activeBay[2];
    }
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
    if(data.length > 0) {
    // Populate table body
    data.forEach(item => {
        const row = document.createElement('tr');
        //console.log(item)

        const div = document.createElement('div');
        div.setAttribute('draggable', 'true');

        // Add dragstart event listener
        div.addEventListener('dragstart', dragstartHandlerTruckCont);
        div.addEventListener('touchstart', touchStartHandlerTruck);
        div.addEventListener('touchmove', touchMoveHandlerTruck);
        div.addEventListener('touchend', touchEndHandler);
        //div.setAttribute('ondragstart', 'dragstartHandler(event)');
        div.setAttribute('id', item.SoCont.trim());
        //div.className = 'st-cont';
        div.setAttribute('data-id', item.SoCont);
        div.setAttribute('data-size', item.KichCo);
        div.innerText = item.SoCont;
        // If you have another data attribute, uncomment the next line
        // div.setAttribute('data-socont', item[1]);

        const cell = document.createElement('td'); // Create a new table cell
        cell.appendChild(div); // Append the div to the cell

        row.appendChild(cell); // Append the cell to the row

        tbody.appendChild(row);
    });
    } else {
        tbody.innerHTML = '<tr><td>Không có dữ liệu </td></tr>';
    }
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
    if(data.length > 0) {
    // Populate table body
    data.forEach(item => {
        const row = document.createElement('tr');
        //console.log(item)
  
        const div = document.createElement('div');
        div.setAttribute('draggable', 'true');

        // Add dragstart event listener
        div.addEventListener('dragstart', dragstartHandlerMoveCont);

        div.addEventListener('touchstart', touchStartHandlerMove);
        div.addEventListener('touchmove', touchMoveHandlerMove);
        div.addEventListener('touchend', touchEndHandlerMove);


        //div.setAttribute('ondragstart', 'dragstartHandler(event)');
        div.setAttribute('id', item.SoCont.trim());
        //div.className = 'st-cont';
        div.setAttribute('data-id', item.SoCont);
        div.setAttribute('data-size', item.KichCo);
        div.innerText = item.SoCont;
        // If you have another data attribute, uncomment the next line
        // div.setAttribute('data-socont', item[1]);

        const cell = document.createElement('td'); // Create a new table cell
        cell.appendChild(div); // Append the div to the cell

        row.appendChild(cell); // Append the cell to the row

        tbody.appendChild(row);
    });
    }
    else {
        tbody.innerHTML = '<tr><td>Không có dữ liệu </td></tr>';
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}
// Example dragstartHandler function
function dragstartHandlerMoveCont(event) {
    localStorage.removeItem('item')
    event.dataTransfer.setData('text', 'move' + event.target.id);
}

function dragstartHandlerTruckCont(event) {
    localStorage.removeItem('item')
    event.dataTransfer.setData('text', 'truck' + event.target.id);
}

// Close popup
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

    let activeBay = activeElement.innerText;
    if (activeBay[1] == 0) {
        activeBay = activeBay[0] + activeBay[2];
    }
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


// Check side of container
function checkSideCont(cont1Id, cont2Id) {
    const box1 = document.getElementById(cont1Id);

    //const box2 = document.getElementById(cont2Id);
    if(box1 != undefined ) {
    const rect1 = box1.getBoundingClientRect();
    //const rect2 = box2.getBoundingClientRect();
    // Cont1 cố định
    console.log('Vi tri cont ' + rect1.right)
    console.log('Vi tri drag ' + cont2Id)
    if (rect1.right < cont2Id) 
        return 'left';
    } else {
        return 'right';
    }
}


function checkMediaQuery() {
    
    const mediaQuery = window.matchMedia('(max-width: 1180px)');
    const divs = document.querySelectorAll('#myTable div');
    
    if (mediaQuery.matches) {
        //document.querySelector('.message').textContent = 'Màn hình nhỏ hơn hoặc bằng 1024px.';
        
        //console.log(divs)
        // Lặp qua từng div và thực hiện hành động
        divs.forEach(div => {
            
            if ((div.getAttribute('data-size'))[0] == '2') {
                
                div.style.width = '25px';
            }
            //console.log(div.textContent); // Hoặc thực hiện hành động khác
        });
    } else {
        divs.forEach(div => {
            if ((div.getAttribute('data-size'))[0] == '2') {
                div.style.width = '';
            }
            //console.log(div.textContent); // Hoặc thực hiện hành động khác
        });
        //document.querySelector('.message').textContent = 'Màn hình lớn hơn 1024px.';
    }
}

// Kiểm tra ngay khi tải trang
checkMediaQuery();

// Thêm sự kiện lắng nghe thay đổi kích thước màn hình
window.addEventListener('resize', checkMediaQuery);