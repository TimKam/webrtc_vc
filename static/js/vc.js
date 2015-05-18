$(document).ready(function() { //wait for DOM to be ready for JS execution
	easyrtc.setVideoDims(640, 480);
	easyrtc.easyApp('vcdemo', 'self', ['peer'], connectSuccess, failureCallback); //connect to easyrtc app; initiate media sources and elements
});

//global state variables
var myEasyrtcId; //id of client in the signaling framework

//global functions
var connectSuccess = function(easyrtcid) { //join room as defined by "room" parameter in URL
	myEasyrtcId = easyrtcid;
	console.log('Connect successful. My id is ' + myEasyrtcId + '.');
	var room = decodeURIComponent((new RegExp('[?|&]room=' + '([^&;]+?)(&|#|;|$)'). //retrieve room name from URL
		exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	console.log('join room: ' + room);
	easyrtc.joinRoom(room, null, joinSuccess, failureCallback);
};

var failureCallback = function(errorCode, errorMsg) { //log error
	console.log(errorCode);
	console.log(errorMsg);
};

var joinSuccess = function(roomName) { //listen for peers joining the room
	setTimeout(function() {
		console.log('successfully joined room: ' + roomName);
		var peers = easyrtc.getRoomOccupantsAsArray(roomName) || []; //get list of client connected to room
		console.log('peers: ' + peers);
		var peersLength = peers.length;
		if (peersLength > 2) { //support only 1-1 video conferences
			alert('The meeting room is already full. ' +
				'Only the two peers connecting first will be allowed access.');
		} else if(peersLength === 1) { //if no other peer is connected
			console.log('waiting for peer to connect...');
		} else if(peers[0] != myEasyrtcId) {//get peer id
			easyrtc.call(peers[0]);
		} else {
			easyrtc.call(peers[1]);
		}
	}, 100);
};