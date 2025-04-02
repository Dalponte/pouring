const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.4.2:1883');

// Create a tap event similar to what the MQTT controller expects
const tapEvent = {
  type: 'AUTO_SERVICE', // Using DispenseType.AUTO_SERVICE as seen in the controller
  tapId: 'tap-uuid-1',  // ID of the tap
  tagId: '1234',        // Optional tag ID
  meta: {
    state: 'calculating',
    flowCount: 2000,
    volume: 330,
    flowVolumeFactor: 0.5,
    rfid: '123456'
  },
  message: null,
  timestamp: new Date().toISOString()
};

client.on('connect', () => {
  console.log('Connected to MQTT server');
  
  // Publish a test message
  client.publish('test/topic', 'Hello from another computer!');
  
  // Publish a tap event to the topic the controller is listening on
  console.log('Publishing tap event:', JSON.stringify(tapEvent, null, 2));
  client.publish('tap/events', JSON.stringify(tapEvent));
  
  // Close the connection after a short delay
  setTimeout(() => {
    console.log('Disconnecting from MQTT server');
    client.end();
  }, 2000);
});

client.on('error', (error) => {
  console.error('MQTT Error:', error);
  client.end();
});

