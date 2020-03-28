let draggingElement = null
let targetElement = null

const onCardDragStart = (e) => {
  draggingElement = e.target
}

const onCardDragOver = (e) => {
  e.preventDefault()

  targetElement = e.target

  if (draggingElement === targetElement) return

  const temp = document.createElement('div')
  draggingElement.parentNode.insertBefore(temp, draggingElement)
  targetElement.parentNode.insertBefore(draggingElement, targetElement)
  temp.parentNode.insertBefore(targetElement, temp)
  temp.parentNode.removeChild(temp)
}
