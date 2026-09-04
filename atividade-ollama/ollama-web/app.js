const OLLAMA_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = 'llama3.2:latest';

const form = document.querySelector('#prompt-form');
const promptInput = document.querySelector('#prompt');
const submitButton = document.querySelector('#submit-button');
const statusElement = document.querySelector('#status');
const responseElement = document.querySelector('#response');
const counterElement = document.querySelector('#counter');

promptInput.addEventListener('input', () => {
  counterElement.textContent = `${promptInput.value.length}/2000`;
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = promptInput.value.trim();
  if (!prompt) {
    showStatus('Digite um prompt antes de enviar.', 'error');
    return;
  }

  setLoading(true);
  showStatus('Gerando resposta...', 'loading');
  responseElement.textContent = '';

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`HTTP ${response.status}: ${details}`);
    }

    const data = await response.json();
    const content = data.message?.content?.trim();

    if (!content) {
      throw new Error('O Ollama respondeu sem conteúdo utilizável.');
    }

    responseElement.textContent = content;
    showStatus(`Resposta gerada pelo modelo ${data.model}.`, 'success');
  } catch (error) {
    console.error(error);
    responseElement.textContent = 'Não foi possível gerar a resposta.';
    showStatus(error.message, 'error');
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  promptInput.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Enviando...' : 'Enviar';
}

function showStatus(message, type) {
  statusElement.textContent = message;
  statusElement.dataset.type = type;
}