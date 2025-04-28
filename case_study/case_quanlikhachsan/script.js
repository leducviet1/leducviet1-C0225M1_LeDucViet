class Room {
    id;
    image;
    price;
    people;
    rating;
    status;

    constructor(id, image, price, people = 0, rating, status = 'available') {
        this.id = id;
        this.image = image;
        this.price = price;
        this.people = people;
        this.rating = rating;
        this.status = status;
    }

}

let rooms = [new Room(1, 'image/1.jpeg', 1000000, '', 'high-end', 'BOOKED'),
    new Room(2, 'image/2.jpg', 1200000, '', 'normal', 'available'),
    new Room(3, 'image/3.jpg', 1200000, '', 'normal', 'available'),
    new Room(4, 'image/4.jpg', 1500000, '', 'high-end', 'available'),];

function displayRoom() {
    const tableBody = document.getElementById('room-list');
    tableBody.innerHTML = '';
    let row = '';
    for (let i = 0; i < rooms.length; i++) {
        console.log(rooms[i]);
        row += `<tr>
    <td>${rooms[i].id}</td>
    <td><img src="${rooms[i].image}" width="200"></td>
    <td>${rooms[i].price.toLocaleString()}VND</td>
    <td>${rooms[i].people}</td>
    <td>${rooms[i].rating}</td>
    <td>${rooms[i].status}</td>
</tr>`;
    }
    tableBody.innerHTML = row;
}

displayRoom();


function selectRoom() {
    const select = document.getElementById('room-select');
    rooms.forEach((room) => {
        if (room.status === "available") {
            const option = document.createElement('option'); //Tạo ra thẻ option
            option.value = room.id;
            option.textContent = `Phòng ${room.id} - ${room.price.toLocaleString()} VND - Chất lượng ${room.rating}`;
            select.appendChild(option);
        }
    })
}

selectRoom();


function bookingRoom() {
    document.getElementById('booking-form').style.display = 'block';
    document.getElementById('booking-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const roomID = parseInt(document.getElementById('room-select').value);
        const people = parseInt(document.getElementById('people').value);
        const room = rooms.find(room => room.id === roomID);
        if (room && room.status === 'available') {
            room.people = people;
            room.status = 'BOOKED';
            alert(`Đặt phòng ${roomID} thành công`);
            document.getElementById('room-select').value = "";
            document.getElementById('people').value = "";
            document.getElementById('booking-form').style.display = 'none';
            displayRoom();
            saveRoomsToStorage()
        } else {
            alert("Phòng không khả dụng");
        }
    });
}

function addRoom() {
    document.getElementById('add-room').style.display = 'block';
}

document.getElementById('add-room').addEventListener('submit', function (e) {
    e.preventDefault();
    const roomID = parseInt(document.getElementById('room-id').value);
    const imageFile = document.getElementById('image-form').files[0];
    const priceRoom = document.getElementById('price').value;
    const ratingRoom = document.getElementById('rating').value;
    const statusRoom = document.getElementById('status').value;
    if (!roomID || !imageFile || !priceRoom || !ratingRoom || !statusRoom) {
        alert("Thiếu thông tin")
        return;
    }
    //Xử lý hình ảnh
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function () {
        const imageDataUrl = reader.result;
        const newRoom = new Room(roomID, imageDataUrl, priceRoom, 0, ratingRoom, statusRoom);
        rooms.push(newRoom);
        alert("Thêm phòng thành công")
        document.getElementById('add-room').style.display = "none";
        displayRoom();
        saveRoomsToStorage()
    };
    reader.onerror = function () {
        alert("Đã có lỗi khi đọc hình ảnh.");
    }
});

function deleteRoom() {
    let roomID = parseInt(prompt("Nhập số phòng bạn muốn xóa"));
    const deletedItem = rooms.find(room => room.id === roomID);
    if (!deletedItem) {
        alert("Không tìm thấy phòng với số này.");
        return;
    }
    if (confirm(`Bạn có muốn xóa phòng ${deletedItem.id} không? `)) {
        rooms = rooms.filter(room => room.id !== deletedItem.id);
        alert(`Đã xóa phòng ${deletedItem.id} thành công.`);
        displayRoom();
        saveRoomsToStorage()
        selectRoom();
    }
}

let editingRoom = null;

function editRoom() {
    let roomID_Edit = parseInt(prompt("Nhập số phòng bạn muốn chỉnh sửa"));
    const room = rooms.find(room => room.id === roomID_Edit);
    if (!room) {
        alert("Không tìm thấy phòng bạn muốn sửa");
        return;
    }
    editingRoom = room;
    document.getElementById('edit-room').style.display = 'block';
    document.getElementById('edit-room-id').value = room.id;
    document.getElementById('edit-image-preview').src = room.image;
    document.getElementById('edit-price').value = room.price;
    document.getElementById('edit-rating').value = room.rating;
    document.getElementById('edit-status').value = room.status;
}

document.getElementById('edit-room').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!editingRoom) return;
    const newPrice = document.getElementById('edit-price').value;
    const newRating = document.getElementById('edit-rating').value;
    const newStatus = document.getElementById('edit-status').value;
    const newImageFile = document.getElementById('edit-image-form').files[0];
    editingRoom.price = parseInt(newPrice);
    editingRoom.rating = newRating;
    editingRoom.status = newStatus;

    if (newImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(newImageFile);
        reader.onloadend = function () {
            editingRoom.image = reader.result;
            finishEdit();
        };
        reader.onerror = function () {
            alert("Lỗi khi đọc ảnh mới.");
        };
    } else {
        finishEdit();
    }
});

// Hàm hoàn tất việc sửa
function finishEdit() {
    editingRoom = null;
    document.getElementById('edit-room').style.display = 'none';
    displayRoom();
    saveRoomsToStorage()
    alert("Cập nhật phòng thành công!");
}


function saveRoomsToStorage() {
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

function loadRoomsFromStorage() {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
        const parsedRooms = JSON.parse(storedRooms);
        rooms = parsedRooms.map(room => new Room(room.id, room.image, room.price, room.people, room.rating, room.status));
    }
}

loadRoomsFromStorage();
displayRoom();
selectRoom();