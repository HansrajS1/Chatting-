const ws = new WebSocket('ws://localhost:8080');
    const messagesDiv = document.getElementById('messages');
    const textInput = document.getElementById('text');
    const sendButton = document.getElementById('send');

    function appendMessage(text, sender) {
      const msg = document.createElement('div');
      msg.classList.add('message', sender);
      msg.textContent = sender === 'you' ? `You: ${text}` : `Friend: ${text}`;
      messagesDiv.appendChild(msg);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function sendMessage() {
      const message = textInput.value.trim();
      if (message) {
        ws.send(message);
        appendMessage(message, 'you');
        textInput.value = '';
      }
    }

    sendButton.onclick = sendMessage;

    textInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    ws.onmessage = function(event) {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
          appendMessage(reader.result, 'friend');
        };
        reader.readAsText(event.data);
      } else {
        appendMessage(event.data, 'friend');
      }
    };