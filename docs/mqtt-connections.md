# MQTT Connection Examples

## Connecting from WiFi devices

Any device on your local network can connect to the MQTT broker using:
- Broker Address: Your server's IP address (e.g., 192.168.1.x)
- Port: 1883 (standard MQTT) or 9001 (WebSockets)
- No authentication required (anonymous allowed)

## Arduino with Network Shield Example

```cpp
#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

// Network configuration
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress server(192, 168, 1, X); // Replace X with your server's last IP octet
EthernetClient ethClient;
PubSubClient client(ethClient);

void setup() {
  Serial.begin(9600);
  
  // Start Ethernet connection
  Ethernet.begin(mac);
  delay(1500); // Give time for connection
  
  // Set MQTT server and port
  client.setServer(server, 1883);
  client.setCallback(callback);
  
  // Connect to MQTT
  reconnect();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ArduinoClient")) {
      Serial.println("connected");
      client.subscribe("bera/commands");
    } else {
      Serial.println("failed, retrying in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Handle incoming messages here
  Serial.print("Message received on topic: ");
  Serial.println(topic);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Publish sensor data every 30 seconds
  static unsigned long lastPublish = 0;
  if (millis() - lastPublish > 30000) {
    float temperature = readTemperature(); // Your sensor reading function
    
    char tempString[8];
    dtostrf(temperature, 6, 2, tempString);
    
    client.publish("bera/temperature", tempString);
    lastPublish = millis();
  }
}

float readTemperature() {
  // Replace with your actual sensor reading code
  return 22.5;
}
```

## Browser-based Clients

For JavaScript applications running in a browser, use the WebSocket connection:

```javascript
// Using MQTT.js
const client = mqtt.connect('ws://your-server-ip:9001');

client.on('connect', function() {
  console.log('Connected to MQTT broker');
  client.subscribe('bera/temperature');
});

client.on('message', function(topic, message) {
  console.log(`Message on ${topic}: ${message.toString()}`);
});
```

## Mobile Apps

Many MQTT client apps like MQTT Explorer, IoT MQTT Panel, or MQTT Dash can connect to your broker by entering your server's IP address and port 1883.
