const mapCardToAsset = (card) => {
  let cardCode

  switch (card.value) {
    case 1:
      cardCode = '3'
      break
    case 2:
      cardCode = '4'
      break
    case 3:
      cardCode = '5'
      break
    case 4:
      cardCode = '6'
      break
    case 5:
      cardCode = '7'
      break
    case 6:
      cardCode = '8'
      break
    case 7:
      cardCode = '9'
      break
    case 8:
      cardCode = '10'
      break
    case 9:
      cardCode = 'J'
      break
    case 10:
      cardCode = 'Q'
      break
    case 11:
      cardCode = 'K'
      break
    case 12:
      cardCode = 'A'
      break
    case 13:
      cardCode = '2'
      break
  }

  return cardCode + card.category
}
