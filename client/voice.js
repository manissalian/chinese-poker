const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
const VIDEO = true
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
    getUserMedia(
      {
        video: VIDEO,
        audio: true
      }, (stream) => {
        userMediaSuccess(call, stream)
      },
      userMediaFail
    )
  })
}

socket.on('joinedVoice', peerId => {
  if (peerId === peer.id) return

  getUserMedia(
    {
      video: VIDEO,
      audio: true
    }, (stream) => {
      const call = peer.call(peerId, stream)
      userMediaSuccess(call, stream)
    },
    userMediaFail
  )
})

const userMediaSuccess = (call, stream) => {
  call.answer(stream)
  call.on('stream', (remoteStream) => {
    if (VIDEO) addVideoElement(remoteStream)
    else addAudioElement(remoteStream)
  })
}
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
  const video = document.createElement('video')
  video.className = 'video-chat'
  video.setAttribute('controls', '');
  video.srcObject = mediaSource
  document.getElementById('peers-container').appendChild(video)
  video.play()
}
