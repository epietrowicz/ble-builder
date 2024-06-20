export const dataViewToBinary = (dataView) => {
  let binaryString = '0b'
  for (let i = 0; i < dataView.byteLength; i++) {
    const byte = dataView.getUint8(i)
    binaryString += byte.toString(2).padStart(8, '0')
  }
  return binaryString
}

export const dataViewToHex = (dataView) => {
  let hexString = '0x'
  for (let i = 0; i < dataView.byteLength; i++) {
    const byte = dataView.getUint8(i)
    hexString += ('0' + byte.toString(16)).slice(-2)
  }
  return hexString
}

export const parseIncomingValue = (result) => {
  console.log('result', result)
  switch (result.byteLength) {
    case 1:
      return result.getInt8(result)
    case 2:
      return result.getInt16(result)
    case 4:
      return result.getInt32(result)
  }
}

export const writeToCharacteristic = async (encodedValue, characteristic, onError) => {
  try {
    if (characteristic !== null) {
      if (characteristic.properties.writeWithoutResponse) {
        await characteristic.writeValueWithoutResponse(encodedValue)
      } else {
        await characteristic.writeValueWithResponse(encodedValue)
      }
    }
  } catch (e) {
    if (onError) onError(e)
    console.log(e)
  }
}

export const numberToUint8Array = (number) => {
  let binaryStr = number.toString(2)
  while (binaryStr.length % 8 !== 0) {
    binaryStr = '0' + binaryStr
  }
  const bytes = binaryStr.match(/.{1,8}/g)
  return new Uint8Array(bytes.map(byte => parseInt(byte, 2)))
}
