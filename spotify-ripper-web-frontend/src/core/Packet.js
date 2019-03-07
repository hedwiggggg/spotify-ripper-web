const Packet = (packetId, packetData) => {
  const packet = {
    id: packetId,
    data: packetData
  };

  return JSON.stringify(packet);
};

export default Packet;
