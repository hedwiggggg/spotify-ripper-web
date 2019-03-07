module.exports = (packetId, packetData) => {
  var packet = {
    id: packetId,
    data: packetData
  };

  return JSON.stringify(packet);
}