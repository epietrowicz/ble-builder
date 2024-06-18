export const parseIncomingValue = (result) => {
  switch (result.byteLength) {
    case 1:
      return result.getInt8(0)
    case 2:
      return result.getInt16(0)
    case 4:
      return result.getInt32(0)
  }
}

export const writeToCharacteristic = async (encodedValue, characteristic) => {
  try {
    if (characteristic !== null) {
      if (characteristic.properties.writeWithoutResponse) {
        await characteristic.writeValueWithoutResponse(encodedValue)
      } else {
        await characteristic.writeValueWithResponse(encodedValue)
      }
    }
  } catch (e) {
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
