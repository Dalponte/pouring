import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883"); // Ajuste se necessário

client.on("connect", () => {
    console.log("✅ Conectado ao MQTT");
    client.publish("bera-beer/test", "Teste 2  de evento via Node.js", () => {
        console.log("📡 Evento publicado!");
        client.end(); // Fecha a conexão após enviar o evento
    });
});
