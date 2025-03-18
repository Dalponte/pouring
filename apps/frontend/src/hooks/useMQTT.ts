import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER_URL = "ws://localhost:9001"; // WebSocket MQTT
const TOPIC = 'operation'

export function useMQTT(topic: string) {
    const [messages, setMessages] = useState<string[]>([]);
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);

    useEffect(() => {
        const client = mqtt.connect(MQTT_BROKER_URL);

        client.on("connect", () => {
            console.log("Conectado ao MQTT");
            client.subscribe(topic);
        });

        client.on("message", (topic, payload) => {
            console.log(`📥 Mensagem recebida: [${topic}] ${payload.toString()}`);
            setMessages((prev) => [...prev, payload.toString()]);
        });

        client.on("error", (err) => {
            console.error("❌ Erro na conexão MQTT", err);
        });

        setClient(client);

        return () => {
            client.end();
        };
    }, [topic]);


    const sendMessage = () => {
        if (client) {
            client.publish(TOPIC, "Mensagem de teste do Frontend", { qos: 1 });
            console.log("📡 Mensagem enviada pelo frontend!");
        }
    };

    return { messages, sendMessage };
}
