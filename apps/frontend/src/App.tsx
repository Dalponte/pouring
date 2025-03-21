import { useMQTT } from "./hooks/useMQTT";

function App() {
  const { messages, sendMessage } = useMQTT("tap/events");

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bera-Beer Dashboard</h1>

      <button onClick={sendMessage}>Enviar Mensagem MQTT</button>

      <h2>Último Evento MQTT:</h2>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

    </div>
  );
}

export default App;
