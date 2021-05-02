const VIDEO = true
let peer
let joinVoice
let callList = {};
const getUserMedia = navigator.mediaDevices ? navigator.mediaDevices.getUserMedia : undefined
let myStream

joinVoice = (roomId) => {
  peer = new Peer()

  peer.on('open', (peerId) => {
    console.log('My peer ID is: ' + peerId)

    socket.emit('joinVoice', {
      peerId,
      roomId
    })
  })

  peer.on('call', (call) => {
    if (myStream) {
      call.answer(myStream)
      call.on('stream', remoteStream => {
        if (VIDEO) addVideoElement(remoteStream)
        else addAudioElement(remoteStream)
      })
    } else if (getUserMedia) {
      getUserMedia({
        video: VIDEO,
        audio: true
      }).then((stream) => {
        myStream = stream
        myStream.playerId = playerName
        call.answer(myStream)
        call.on('stream', remoteStream => {
          if (VIDEO) addVideoElement(remoteStream)
          else addAudioElement(remoteStream)
        })
      }).catch(userMediaFail)
    }
  })
}

socket.on('joinedVoice', peerId => {
  if (peerId === peer.id) return

  if (myStream) {
    const call = peer.call(peerId, myStream)
    call.on('stream', remoteStream => {
      if (VIDEO) addVideoElement(remoteStream)
      else addAudioElement(remoteStream)
    })
  } else if (getUserMedia) {
    getUserMedia({
      video: VIDEO,
      audio: true
    }).then((stream) => {
      myStream = stream
      myStream.playerId = playerName
      const call = peer.call(peerId, myStream)
      call.on('stream', remoteStream => {
        if (VIDEO) addVideoElement(remoteStream)
        else addAudioElement(remoteStream)
      })
    }).catch(userMediaFail)
  }
})

socket.on('quitVoice', ({ playerId }) => {
  if (playerId === playerName) return
  if (callList[playerId]) {
    callList[playerId].remove()
    delete callList[playerId]
  }
})

const userMediaFail = (err) => {
  console.log('Failed to get local stream', err)
}

const addAudioElement = (mediaSource) => {
  const container = document.getElementById('peers-container')
  const audio = document.createElement('audio')
  audio.srcObject = mediaSource
  container.appendChild(audio)
  container.style["flex"] = "0"
  audio.play()
}

const addVideoElement = (mediaSource) => {
  if (callList[mediaSource.playerId]) {
    callList[mediaSource.playerId].remove()
  }
  const video = document.createElement('video')
  callList[mediaSource.playerId] = video;
  video.className = 'video-chat'
  video.setAttribute('controls', '');
  video.srcObject = mediaSource
  document.getElementById('peers-container').appendChild(video)
  video.play()
}

const destroyPeerConnection = () => {
  for (c in callList) {
    callList[c].remove()
  }
  callList = {}
  socket.emit("quitVoice", {
    playerId: playerName,
    peerId: peer.id,
    roomId: _roomId,
    streamId: myStream ? myStream.id : null
  })
  peer.destroy()
  peer = undefined
}
