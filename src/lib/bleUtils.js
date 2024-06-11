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
