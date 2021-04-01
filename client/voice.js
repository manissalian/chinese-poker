const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
let peer

const joinVoice = (roomId) => {
  peer = new Peer()

  peer.on('open', (peerId) => {
    console.log('My peer ID is: ' + peerId)

    socket.emit('joinVoice', {
      peerId,
      roomId
    })
  })

  peer.on('call', (call) => {
    getUserMedia({
      video: false,
      audio: true
    }, (stream) => {
      call.answer(stream)
      call.on('stream', (remoteStream) => {
        addAudioElement(remoteStream)
      })
    }, (err) => {
      console.log('Failed to get local stream', err)
    })
  })
}

const addAudioElement = (mediaSource) => {
  const audio = document.createElement('audio')
  audio.srcObject = mediaSource
  document.getElementById('voice-chat').appendChild(audio)
  audio.play()
}

socket.on('joinedVoice', peerId => {
  if (peerId === peer.id) return

  getUserMedia({
    video: false,
    audio: true
  }, (stream) => {
    const call = peer.call(peerId, stream)
    call.on('stream', (remoteStream) => {
      addAudioElement(remoteStream)
    })
  }, (err) => {
    console.log('Failed to get local stream' ,err)
  });
})
