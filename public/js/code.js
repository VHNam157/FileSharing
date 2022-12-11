(function(){

	const socket = io(); //Hằng socket
	let receiverID; //Mã người nhận

	//Hàm sinh mã phòng gồm 9 chữ số với 3 cụm số được random tới 999
	function generateID(){
		return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`;
	}

	//Event Listener cho hành động click vào nút tạo phòng.
	document.querySelector("#sender-start-con-btn").addEventListener("click",function(){
		let joinID = generateID();
		document.querySelector("#join-id").innerHTML = `
			<b>Room ID</b>
			<span>${joinID}</span>
		`;
		socket.emit("sender-join", {
			uid:joinID
		});
	});

	//Khởi tạo socket. Kích hoạt giao diện chia sẻ file và tắt giao diện join phòng
	socket.on("init",function(uid){
		receiverID = uid;
		document.querySelector(".join-screen").classList.remove("active");
		document.querySelector(".fs-screen").classList.add("active");
	});

	//Event Listener cho hành động thêm file.
	document.querySelector("#file-input").addEventListener("change",function(e){
		let file = e.target.files[0];
		if(!file){
			return;		
		}
		let reader = new FileReader();
		reader.onload = function(e){
			let buffer = new Uint8Array(reader.result);

			let el = document.createElement("div");
			el.classList.add("item");
			el.innerHTML = `
					<div class="progress">0%</div>
					<div class="filename">${file.name}</div>
			`;
			document.querySelector(".files-list").appendChild(el);
			shareFile({
				filename: file.name,
				total_buffer_size:buffer.length,
				buffer_size:1024,
			}, buffer, el.querySelector(".progress"));
		}
		reader.readAsArrayBuffer(file);
	});


	function shareFile(metadata,buffer,progress_node){
		socket.emit("file-meta", {
			uid:receiverID,
			metadata:metadata
		});
		
		socket.on("fs-share",function(){
			let chunk = buffer.slice(0,metadata.buffer_size);
			buffer = buffer.slice(metadata.buffer_size,buffer.length);
			progress_node.innerText = Math.trunc(((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100));
			if(chunk.length != 0){
				socket.emit("file-raw", {
					uid:receiverID,
					buffer:chunk
				});
			} else {
				console.log("File được gửi đi thành công!");
			}
		});
	}
})();