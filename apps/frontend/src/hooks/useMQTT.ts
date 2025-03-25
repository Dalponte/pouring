import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER_URL = "ws://localhost:9001";
const TOPIC = 'tap/events'

// Define DispenseType enum
export enum DispenseType {
    AUTO_SERVICE = 'AUTO_SERVICE',
    MAINTENANCE = 'MAINTENANCE',
    ORDER = 'ORDER',
    LOSS = 'LOSS',
}

// Define TapEvent interface
export interface TapEvent {
    tapId: string;
    type: DispenseType;
    tagId?: string;
    meta?: Record<string, any>;
    message?: string | null;
    timestamp?: string;
}

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
            const event: TapEvent = {
                tapId: '38098105-7fc0-484f-824c-8b6dc38b06bf',
                type: DispenseType.AUTO_SERVICE,
                tagId: '28',
                meta: { amount: 300 },
                timestamp: new Date().toISOString()
            };

            client.publish(
                TOPIC,
                JSON.stringify(event),
                { qos: 1 });
            console.log("📡 Mensagem enviada pelo frontend!", event);
        }
    };

    return { messages, sendMessage };
}
