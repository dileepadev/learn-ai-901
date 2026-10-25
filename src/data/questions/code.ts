import type { AuthoredQuestion } from '../types';

/**
 * Code-reading questions: complete or read a short Python snippet. The
 * snippets follow the code in the official AI-901 training units and the
 * Microsoft Learn quickstarts.
 *
 * Every class, method and parameter here, right or wrong, is real. Wrong
 * options are real APIs used in the wrong place, never invented names.
 */

/** A snippet, one string per line, so the code reads as code in this file. */
const py = (...lines: string[]) => lines.join('\n');

const SPEECH = 'Build a lightweight application by using Azure Speech in Foundry Tools';
const TEXT = 'Build a lightweight application that includes text analysis';

export const codeQuestions: AuthoredQuestion[] = [
  /* ---------------- Azure Speech ---------------- */
  {
    id: 'code-sp-01',
    type: 'dropdown',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'medium',
    kind: 'exam',
    prompt: "A Python app reads a message aloud through the computer's speaker. Complete the code.",
    code: py(
      `import os`,
      `import azure.cognitiveservices.speech as speechsdk`,
      ``,
      `speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('FOUNDRY_KEY'), endpoint=os.environ.get('ENDPOINT'))`,
      `audio_config = speechsdk.audio.___(use_default_speaker=True)`,
      `speech_config.speech_synthesis_voice_name = 'en-US-Ava:DragonHDLatestNeural'`,
      ``,
      `speech_synthesizer = speechsdk.___(speech_config=speech_config, audio_config=audio_config)`,
      `speech_synthesis_result = speech_synthesizer.___(text).get()`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'AudioOutputConfig', correct: true },
          {
            id: 'b',
            text: 'AudioConfig',
            correct: false,
            why: 'AudioConfig sets where audio comes in from, such as a microphone or a file. Playing audio out to a speaker needs AudioOutputConfig.',
          },
          {
            id: 'c',
            text: 'SpeechConfig',
            correct: false,
            why: 'SpeechConfig holds the key, endpoint and voice. It does not choose an audio device.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'SpeechSynthesizer', correct: true },
          {
            id: 'b',
            text: 'SpeechRecognizer',
            correct: false,
            why: 'A SpeechRecognizer turns speech into text, the opposite direction.',
          },
          {
            id: 'c',
            text: 'SpeechConfig',
            correct: false,
            why: 'SpeechConfig is the configuration you pass in, not the object that speaks.',
          },
        ],
      },
      {
        id: 'b3',
        options: [
          { id: 'a', text: 'speak_text_async', correct: true },
          {
            id: 'b',
            text: 'recognize_once_async',
            correct: false,
            why: 'A SpeechRecognizer method that transcribes a single utterance.',
          },
          {
            id: 'c',
            text: 'start_continuous_recognition',
            correct: false,
            why: 'A SpeechRecognizer method that keeps transcribing until you stop it.',
          },
        ],
      },
    ],
    explanation:
      'Text to speech is **SpeechConfig** (key, endpoint, voice) plus **AudioOutputConfig** (where the audio goes) plus a **SpeechSynthesizer**, then `speak_text_async(text).get()`. Speech to text mirrors it with AudioConfig and a SpeechRecognizer.',
    reference: {
      label: 'Speech synthesis - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-speech-azure/3-speech-synthesis',
      quote: 'First, connect to the endpoint for Azure Speech. Then, create a SpeechSynthesizer object.',
    },
    tags: ['code', 'speech', 'sdk'],
  },
  {
    id: 'code-sp-02',
    type: 'dropdown',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'A Python app must keep transcribing what a user says into their microphone until the user stops it. Complete the code.',
    code: py(
      `speech_config = speechsdk.SpeechConfig(`,
      `    subscription=speech_key,`,
      `    endpoint=endpoint_url`,
      `)`,
      ``,
      `audio_config = speechsdk.audio.AudioConfig(___=True)`,
      `speech_recognizer = speechsdk.SpeechRecognizer(`,
      `    speech_config=speech_config,`,
      `    audio_config=audio_config`,
      `)`,
      ``,
      `speech_recognizer.recognized.connect(recognized_handler)`,
      `speech_recognizer.___()`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'use_default_microphone', correct: true },
          {
            id: 'b',
            text: 'use_default_speaker',
            correct: false,
            why: 'That parameter belongs to AudioOutputConfig, for playing audio out.',
          },
          {
            id: 'c',
            text: 'filename',
            correct: false,
            why: 'filename reads audio from a file, but this app listens to the microphone.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'start_continuous_recognition', correct: true },
          {
            id: 'b',
            text: 'recognize_once_async',
            correct: false,
            why: 'It transcribes one utterance of up to 30 seconds, or until silence, and then stops. This app must keep listening.',
          },
          {
            id: 'c',
            text: 'speak_text_async',
            correct: false,
            why: 'A SpeechSynthesizer method that speaks text aloud.',
          },
        ],
      },
    ],
    explanation:
      '`AudioConfig(use_default_microphone=True)` captures the microphone. `start_continuous_recognition()` keeps transcribing, raising a `recognized` event for each phrase, until the app calls `stop_continuous_recognition()`.',
    reference: {
      label: 'Speech recognition - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-speech-azure/2-speech-recognition',
      quote:
        'To transcribe the message, start by specifying the endpoint and key and the audio source you want to transcribe. Then use a SpeechRecognizer object to perform the transcription, before displaying the results.',
    },
    tags: ['code', 'speech', 'sdk'],
  },
  {
    id: 'code-sp-03',
    type: 'dropdown',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'A voice command app transcribes one short spoken command and prints it. Complete the code.',
    code: py(
      `speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)`,
      ``,
      `result = speech_recognizer.___().get()`,
      ``,
      `if result.reason == speechsdk.ResultReason.___:`,
      `    print(result.text)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'recognize_once_async', correct: true },
          {
            id: 'b',
            text: 'start_continuous_recognition',
            correct: false,
            why: 'It keeps listening and reports phrases through events, instead of returning one result to read.',
          },
          {
            id: 'c',
            text: 'speak_text_async',
            correct: false,
            why: 'A SpeechSynthesizer method that speaks text, the opposite direction.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'RecognizedSpeech', correct: true },
          {
            id: 'b',
            text: 'SynthesizingAudioCompleted',
            correct: false,
            why: 'The reason a SpeechSynthesizer returns when it has finished speaking.',
          },
          {
            id: 'c',
            text: 'NoMatch',
            correct: false,
            why: 'NoMatch means no speech could be recognised, so there is no text to print.',
          },
        ],
      },
    ],
    explanation:
      '`recognize_once_async().get()` transcribes a single utterance and returns its result. Check `result.reason` for `ResultReason.RecognizedSpeech` before reading `result.text`; `NoMatch` and `Canceled` are the other outcomes.',
    reference: {
      label: 'Quickstart: Recognize and convert speech to text',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/get-started-speech-to-text',
      quote:
        'This example uses the recognize_once_async operation to transcribe utterances of up to 30 seconds, or until silence is detected.',
    },
    tags: ['code', 'speech', 'sdk'],
  },
  {
    id: 'code-sp-04',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'easy',
    kind: 'exam',
    scenario: 'This line configures a speech recognizer to listen to the microphone.',
    prompt: 'The app must transcribe a recorded file, `call.wav`, instead. Which line should replace it?',
    code: py(`audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)`),
    options: [
      { id: 'a', text: '`audio_config = speechsdk.audio.AudioConfig(filename="call.wav")`', correct: true },
      {
        id: 'b',
        text: '`audio_config = speechsdk.audio.AudioOutputConfig(filename="call.wav")`',
        correct: false,
        why: 'AudioOutputConfig is for output. With a filename, it writes synthesised speech into that file.',
      },
      {
        id: 'c',
        text: '`speech_config = speechsdk.SpeechConfig(filename="call.wav")`',
        correct: false,
        why: 'SpeechConfig holds the key, endpoint and service settings. The audio source belongs in AudioConfig.',
      },
      {
        id: 'd',
        text: '`audio_config = speechsdk.audio.AudioConfig(use_default_speaker=True)`',
        correct: false,
        why: 'use_default_speaker is for playing audio out, through AudioOutputConfig. It does not read a file.',
      },
    ],
    explanation:
      'Audio **in** is `AudioConfig`: `use_default_microphone=True` for the microphone, or `filename=` for a file. Audio **out** is `AudioOutputConfig`: `use_default_speaker=True` or `filename=`.',
    reference: {
      label: 'Quickstart: Recognize and convert speech to text',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/get-started-speech-to-text',
      quote: 'To recognize speech from an audio file, use filename instead of use_default_microphone:',
    },
    tags: ['code', 'speech', 'sdk'],
  },
  {
    id: 'code-sp-05',
    type: 'yesno',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'Review this code from an app that uses Azure Speech in Foundry Tools. Which of these statements are true?',
    code: py(
      `speech_config = speechsdk.SpeechConfig(subscription=key, endpoint=endpoint)`,
      `speech_config.speech_synthesis_voice_name = 'en-US-Ava:DragonHDLatestNeural'`,
      `audio_config = speechsdk.audio.AudioOutputConfig(filename="greeting.wav")`,
      ``,
      `speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)`,
      `result = speech_synthesizer.speak_text_async("Welcome to Contoso").get()`,
    ),
    statements: [
      {
        id: 's1',
        text: 'The synthesised speech is written to greeting.wav instead of being played through the speaker.',
        yes: true,
        why: 'AudioOutputConfig with a filename writes the audio to that file. use_default_speaker=True would play it instead.',
      },
      {
        id: 's2',
        text: 'The voice is chosen on the SpeechConfig object.',
        yes: true,
        why: 'speech_synthesis_voice_name is a SpeechConfig setting.',
      },
      {
        id: 's3',
        text: 'speak_text_async transcribes the audio in greeting.wav into text.',
        yes: false,
        why: 'It does the opposite: it turns the text into speech. Transcribing a file needs a SpeechRecognizer with AudioConfig(filename=...).',
      },
    ],
    explanation:
      'Read the direction from the class names: **AudioOutputConfig** and **SpeechSynthesizer** mean text becomes audio, here saved to a file. Recognition would use AudioConfig and a SpeechRecognizer.',
    reference: {
      label: 'How to synthesize speech from text',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/how-to-speech-synthesis',
      quote:
        'Create an AudioOutputConfig instance to automatically write the output to a .wav file by using the filename constructor parameter:',
    },
    tags: ['code', 'speech', 'sdk'],
  },
  {
    id: 'code-sp-06',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'medium',
    kind: 'exam',
    scenario: 'This code should read a message aloud, but it fails.',
    prompt: 'Which line is wrong?',
    code: py(
      `speech_config = speechsdk.SpeechConfig(subscription=key, endpoint=endpoint)            # line 1`,
      `audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)             # line 2`,
      `synthesizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)  # line 3`,
      `result = synthesizer.speak_text_async("Your order has shipped.").get()                 # line 4`,
    ),
    options: [
      { id: 'a', text: 'Line 3: it should create a `SpeechSynthesizer`, not a `SpeechRecognizer`', correct: true },
      {
        id: 'b',
        text: 'Line 2: it should use `AudioConfig` instead of `AudioOutputConfig`',
        correct: false,
        why: 'AudioOutputConfig is right for playing speech through the speaker. AudioConfig is for audio input.',
      },
      {
        id: 'c',
        text: 'Line 1: `SpeechConfig` must also be given a voice name',
        correct: false,
        why: 'The voice is optional and set as a property, speech_synthesis_voice_name. With none set, the default voice for en-US speaks.',
      },
      {
        id: 'd',
        text: 'Line 4: `speak_text_async` must not be followed by `.get()`',
        correct: false,
        why: 'speak_text_async runs asynchronously and returns a future. Calling .get() waits for the result, which is correct.',
      },
    ],
    explanation:
      'A **SpeechRecognizer** has no way to speak: it turns audio into text. Reading text aloud needs a **SpeechSynthesizer**, which takes the same SpeechConfig and AudioOutputConfig.',
    reference: {
      label: 'How to synthesize speech from text',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/how-to-speech-synthesis',
      quote:
        'Create a SpeechSynthesizer object. This object runs text to speech conversions and outputs to speakers, files, or other output streams.',
    },
    tags: ['code', 'speech', 'sdk', 'debug'],
  },
  {
    id: 'code-sp-07',
    topic: 'foundry-text-speech',
    moduleId: 'speech',
    objective: SPEECH,
    difficulty: 'easy',
    kind: 'exam',
    prompt: 'In a Python app that uses Azure Speech in Foundry Tools, which object holds the resource key and endpoint?',
    options: [
      { id: 'a', text: '`SpeechConfig`', correct: true },
      {
        id: 'b',
        text: '`AudioConfig`',
        correct: false,
        why: 'AudioConfig sets the audio input, such as the microphone or a file.',
      },
      {
        id: 'c',
        text: '`SpeechRecognizer`',
        correct: false,
        why: 'The recognizer does the transcribing, using the SpeechConfig you pass to it.',
      },
      {
        id: 'd',
        text: '`AudioOutputConfig`',
        correct: false,
        why: 'AudioOutputConfig sets where synthesised audio goes, such as the speaker or a file.',
      },
    ],
    explanation:
      'Every Speech app starts with a **SpeechConfig**: the key and endpoint (or region), plus settings such as the voice. Recognizers and synthesizers are then built from it.',
    reference: {
      label: 'How to recognize speech',
      url: 'https://learn.microsoft.com/azure/ai-services/speech-service/how-to-recognize-speech',
      quote:
        'To call the Speech service by using the Speech SDK, you need to create a SpeechConfig instance. This class includes information about your Speech resource, like your speech key and associated region, endpoint, host, or authorization token.',
    },
    tags: ['code', 'speech', 'sdk'],
  },

  /* ---------------- Chat client ---------------- */
  {
    id: 'code-gen-01',
    type: 'dropdown',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'A lightweight chat client calls a model deployed in Microsoft Foundry. Complete the code.',
    code: py(
      `import os`,
      `from openai import OpenAI`,
      ``,
      `client = OpenAI(`,
      `    base_url=f"{os.environ['AZURE_OPENAI_ENDPOINT']}/openai",`,
      `    api_key=os.environ["AZURE_OPENAI_API_KEY"]`,
      `)`,
      ``,
      `response = client.___.create(`,
      `    model=os.environ["DEPLOYMENT_NAME"],`,
      `    input=[{"role": "___", "content": "You're a helpful assistant."},`,
      `           {"role": "user", "content": "Summarize the key points from our release notes in 3 bullets."}],`,
      `    max_output_tokens=300,`,
      `    temperature=0.7`,
      `)`,
      ``,
      `print(response.___)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'responses', correct: true },
          {
            id: 'b',
            text: 'embeddings',
            correct: false,
            why: 'The embeddings API returns vectors for search, not a written reply.',
          },
          {
            id: 'c',
            text: 'files',
            correct: false,
            why: 'The files API uploads and manages files. It does not generate a reply.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'system', correct: true },
          {
            id: 'b',
            text: 'assistant',
            correct: false,
            why: "The assistant role marks the model's own earlier replies, not standing instructions.",
          },
          {
            id: 'c',
            text: 'user',
            correct: false,
            why: "The user role carries the end user's request, which is the next message.",
          },
        ],
      },
      {
        id: 'b3',
        options: [
          { id: 'a', text: 'output_text', correct: true },
          {
            id: 'b',
            text: 'choices[0].message.content',
            correct: false,
            why: 'That is how you read a Chat Completions reply. The Responses API gives you output_text.',
          },
          {
            id: 'c',
            text: 'usage',
            correct: false,
            why: 'usage reports how many tokens the call used, not the reply.',
          },
        ],
      },
    ],
    explanation:
      'The Responses API call is `client.responses.create(model=<deployment name>, input=...)`. A **system** message sets behaviour and a **user** message asks the question, and you read the reply from `response.output_text`.',
    reference: {
      label: 'Using a generative AI model - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-with-generative-ai-and-agents/3-using-generative-ai-models',
      quote:
        'Unlike the user prompt, which is the end-user request or question (example: Where should I travel?), a System prompt sets behavior, tone, tools, and guardrails for the assistant.',
    },
    tags: ['code', 'responses-api', 'sdk'],
  },
  {
    id: 'code-gen-02',
    type: 'dropdown',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'easy',
    kind: 'exam',
    scenario: 'You deployed the gpt-4.1 model in Microsoft Foundry and named the deployment gpt-demo-model.',
    prompt: 'Complete the code so that the request reaches that deployment.',
    code: py(
      `client = OpenAI(base_url=endpoint, api_key=api_key)`,
      ``,
      `message = client.responses.create(`,
      `    model=___,`,
      `    input="Classify the sentiment of: The checkout was quick and easy.",`,
      `)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: '"gpt-demo-model"', correct: true },
          {
            id: 'b',
            text: '"gpt-4.1"',
            correct: false,
            why: "That is the model's base name. The request names the deployment you created, gpt-demo-model.",
          },
          {
            id: 'c',
            text: 'api_key',
            correct: false,
            why: 'The key authenticates the client, and it is already set on the OpenAI client.',
          },
        ],
      },
    ],
    explanation:
      'The `model` argument takes the **deployment name** you chose when you deployed. It only matches the model name if you kept the default when deploying.',
    reference: {
      label: 'Create a client application that analyzes text - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/3-language-sdk',
      quote: 'The model deployment name is the name you give the model when you deploy it.',
    },
    tags: ['code', 'responses-api', 'sdk'],
  },
  {
    id: 'code-gen-03',
    type: 'dropdown',
    topic: 'foundry-genai-agents',
    moduleId: 'prompts-and-chat',
    objective: 'Create a lightweight chat client application by using the Foundry SDK',
    difficulty: 'easy',
    kind: 'exam',
    prompt: 'Replies from this chat client must never be longer than 300 tokens. Complete the code.',
    code: py(
      `response = client.responses.create(`,
      `    model=os.environ["DEPLOYMENT_NAME"],`,
      `    input=prompt,`,
      `    ___=300,`,
      `)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'max_output_tokens', correct: true },
          {
            id: 'b',
            text: 'temperature',
            correct: false,
            why: 'Temperature controls how random or focused the reply is, not how long it is.',
          },
          {
            id: 'c',
            text: 'top_p',
            correct: false,
            why: 'top_p also controls randomness, by limiting which tokens are considered. It does not cap length.',
          },
        ],
      },
    ],
    explanation:
      '**max_output_tokens** caps the length of the response, which also bounds its token cost. Temperature and top_p shape how varied the wording is.',
    reference: {
      label: 'Using a generative AI model - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-with-generative-ai-and-agents/3-using-generative-ai-models',
      quote: 'Max output tokens – caps response length; affects token consumption and throttling behavior.',
    },
    tags: ['code', 'parameters', 'sdk'],
  },

  /* ---------------- Agent client ---------------- */
  {
    id: 'code-ag-01',
    type: 'dropdown',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'hard',
    kind: 'exam',
    prompt: 'A Python app calls an existing agent named learning-agent in a Foundry project. Complete the code.',
    code: py(
      `from azure.identity import DefaultAzureCredential`,
      `from azure.ai.projects import AIProjectClient`,
      ``,
      `project_client = AIProjectClient(`,
      `    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",`,
      `    credential=___(),`,
      `)`,
      ``,
      `agent = project_client.agents.get(agent_name="learning-agent")`,
      ``,
      `openai_client = project_client.___()`,
      ``,
      `response = openai_client.responses.create(`,
      `    input=[{"role": "user", "content": "Tell me what you can help with."}],`,
      `    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},`,
      `)`,
      ``,
      `print(response.___)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'DefaultAzureCredential', correct: true },
          {
            id: 'b',
            text: 'AzureKeyCredential',
            correct: false,
            why: 'AzureKeyCredential wraps an API key, but AIProjectClient currently supports only Microsoft Entra ID authentication.',
          },
          {
            id: 'c',
            text: 'SpeechConfig',
            correct: false,
            why: 'SpeechConfig configures Azure Speech. It is not a credential.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'get_openai_client', correct: true },
          {
            id: 'b',
            text: 'deployments.list',
            correct: false,
            why: "It lists the project's model deployments. It does not return a client you can send responses with.",
          },
          {
            id: 'c',
            text: 'connections.list',
            correct: false,
            why: "It lists the project's connected resources, not a client for calling the agent.",
          },
        ],
      },
      {
        id: 'b3',
        options: [
          { id: 'a', text: 'output_text', correct: true },
          {
            id: 'b',
            text: 'choices[0].message.content',
            correct: false,
            why: 'That is the Chat Completions shape. A Responses API call gives you output_text.',
          },
          {
            id: 'c',
            text: 'usage',
            correct: false,
            why: 'usage reports token counts, not the reply.',
          },
        ],
      },
    ],
    explanation:
      'Connect to the project with **AIProjectClient** and **DefaultAzureCredential**, get the agent by name, get an OpenAI-compatible client with **get_openai_client()**, then call the Responses API with an `agent_reference` and read **output_text**.',
    reference: {
      label: 'Creating an agent - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-with-generative-ai-and-agents/4-creating-an-agent',
      quote:
        'You can use an agent from a client application by using the Foundry Projects SDK to connect to the project and call it from a client using the Project API.',
    },
    tags: ['code', 'agents', 'sdk'],
  },
  {
    id: 'code-ag-02',
    topic: 'foundry-genai-agents',
    moduleId: 'agents',
    objective: 'Create a lightweight client application for an agent',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'What does this code do?',
    code: py(
      `agent = project_client.agents.get(agent_name="learning-agent")`,
      `openai_client = project_client.get_openai_client()`,
      ``,
      `response = openai_client.responses.create(`,
      `    input=[{"role": "user", "content": "Tell me what you can help with."}],`,
      `    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},`,
      `)`,
    ),
    options: [
      {
        id: 'a',
        text: 'Retrieves an existing agent and sends it a user message through the Responses API',
        correct: true,
      },
      {
        id: 'b',
        text: 'Creates a new agent called learning-agent and deploys it',
        correct: false,
        why: '`agents.get` retrieves an agent that already exists. Nothing is created or deployed.',
      },
      {
        id: 'c',
        text: 'Sends the message straight to a model deployment, bypassing the agent',
        correct: false,
        why: 'The `agent_reference` in `extra_body` sends the request to the agent, with its own instructions and tools.',
      },
      {
        id: 'd',
        text: "Uploads the agent's instructions to a Foundry IQ knowledge base",
        correct: false,
        why: 'No knowledge base is involved. The code only calls the agent.',
      },
    ],
    explanation:
      'Read it line by line: **get** the agent by name, get an **OpenAI-compatible client** from the project, then **call** the agent through the Responses API by passing an agent reference.',
    reference: {
      label: 'Creating an agent - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-with-generative-ai-and-agents/4-creating-an-agent',
      quote:
        'You can use an agent from a client application by using the Foundry Projects SDK to connect to the project and call it from a client using the Project API.',
    },
    tags: ['code', 'agents', 'sdk'],
  },

  /* ---------------- Vision ---------------- */
  {
    id: 'code-vi-01',
    type: 'dropdown',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'A Python app asks a deployed vision-enabled model what is in a photo. Complete the code.',
    code: py(
      `response = client.responses.create(`,
      `    model=os.getenv("MODEL_NAME"),  # your deployment name`,
      `    input=[`,
      `        {`,
      `            "role": "user",`,
      `            "content": [`,
      `                {"type": "___", "text": "What is in this image? Provide 3 bullet points."},`,
      `                {"type": "___", "image_url": image_url}`,
      `            ],`,
      `        }`,
      `    ],`,
      `)`,
      ``,
      `print(response.output_text)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'input_text', correct: true },
          {
            id: 'b',
            text: 'input_image',
            correct: false,
            why: 'input_image carries an image, but this content part carries the text question.',
          },
          {
            id: 'c',
            text: 'output_text',
            correct: false,
            why: 'output_text is where you read the reply. It is not an input type.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'input_image', correct: true },
          {
            id: 'b',
            text: 'input_text',
            correct: false,
            why: 'This part carries the image URL, so its type is input_image.',
          },
          {
            id: 'c',
            text: 'image_generation',
            correct: false,
            why: 'image_generation is a tool for creating new images, not a way to send one in.',
          },
        ],
      },
    ],
    explanation:
      'One user message carries a **list of content parts**: an `input_text` part with the question and an `input_image` part with the image, as a URL or base64 data. The model answers in `output_text`.',
    reference: {
      label: 'Multimodal models for image analysis - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-vision-azure/2-vision-enabled-models',
      quote:
        'To submit the input to the model, you need to create a multi-part message that includes both the image and text data.',
    },
    tags: ['code', 'vision', 'responses-api'],
  },
  {
    id: 'code-vi-02',
    type: 'dropdown',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Create new visual outputs by using generative models',
    difficulty: 'hard',
    kind: 'exam',
    prompt: 'A Python app generates an image from a text prompt and saves it as a PNG file. Complete the code.',
    code: py(
      `response = client.___.create(`,
      `    model=os.environ["MODEL_NAME"],  # your deployment name in Foundry`,
      `    input=prompt,`,
      `    ___=[{"type": "image_generation"}],`,
      `)`,
      ``,
      `image_base64 = next(`,
      `    item.result for item in response.output`,
      `    if item.type == "image_generation_call"`,
      `)`,
      ``,
      `with open("foundry_generated.png", "wb") as f:`,
      `    f.write(base64.___(image_base64))`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'responses', correct: true },
          {
            id: 'b',
            text: 'embeddings',
            correct: false,
            why: 'Embeddings return vectors for search. Here the image is generated through the Responses API, with a tool.',
          },
          {
            id: 'c',
            text: 'files',
            correct: false,
            why: 'The files API uploads and manages files. It does not generate anything.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'tools', correct: true },
          {
            id: 'b',
            text: 'instructions',
            correct: false,
            why: 'instructions carry system-style guidance as text. The image generation tool goes in tools.',
          },
          {
            id: 'c',
            text: 'input',
            correct: false,
            why: 'input already carries the prompt.',
          },
        ],
      },
      {
        id: 'b3',
        options: [
          { id: 'a', text: 'b64decode', correct: true },
          {
            id: 'b',
            text: 'b64encode',
            correct: false,
            why: 'b64encode turns bytes into base64 text, the opposite of what you need to save the image.',
          },
          {
            id: 'c',
            text: 'encodebytes',
            correct: false,
            why: 'encodebytes also encodes bytes as base64 text. Decoding is what turns the text back into image bytes.',
          },
        ],
      },
    ],
    explanation:
      'Pass `tools=[{"type": "image_generation"}]` to `client.responses.create`. The image comes back as **base64** text on the `image_generation_call` output item, so decode it with `base64.b64decode` before writing the bytes.',
    reference: {
      label: 'Image generation models - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-vision-azure/3-image-generation',
      quote: 'Base64 encoding converts binary data into safe ASCII text, allows binary files to be embedded inside JSON or URLs.',
    },
    tags: ['code', 'image-generation', 'responses-api'],
  },
  {
    id: 'code-vi-03',
    topic: 'foundry-vision',
    moduleId: 'vision',
    objective: 'Interpret visual input in prompts by using a deployed multimodal model',
    difficulty: 'medium',
    kind: 'exam',
    scenario: "An app sends a photo that is stored on the user's own computer to a vision-enabled model deployed in Microsoft Foundry.",
    prompt: 'What should the app put in the `image_url` of the `input_image` content part?',
    options: [
      {
        id: 'a',
        text: 'A base64 data URL: `data:image/jpeg;base64,` followed by the encoded image',
        correct: true,
      },
      {
        id: 'b',
        text: 'The local file path, such as `/home/sam/photos/shelf.jpg`',
        correct: false,
        why: "The model runs in Foundry and cannot read files on the user's computer. Send the image itself as base64, or a URL the service can reach.",
      },
      {
        id: 'c',
        text: 'The raw bytes of the image, written straight into the JSON',
        correct: false,
        why: 'JSON is text, so binary image bytes have to be base64-encoded first.',
      },
      {
        id: 'd',
        text: 'Only the file name, with the image uploaded in a separate request later',
        correct: false,
        why: 'The image travels in the same request as the question, as one multi-part message.',
      },
    ],
    explanation:
      'An image can be sent as a public URL or as **base64 data**. For a local file, read the bytes, base64-encode them, and send `data:<mime type>;base64,<data>`.',
    reference: {
      label: 'Use vision-enabled chat models',
      url: 'https://learn.microsoft.com/azure/foundry/openai/how-to/gpt-with-vision',
      quote:
        'If you want to use a local image, you can use the following Python code to convert it to base64 so it can be passed to the API.',
    },
    tags: ['code', 'vision', 'base64'],
  },

  /* ---------------- Text analysis ---------------- */
  {
    id: 'code-ta-01',
    type: 'dropdown',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: TEXT,
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A Python app detects the language of each customer message with Azure Language in Foundry Tools. Complete the code.',
    code: py(
      `client = ___(endpoint=endpoint, credential=___(key))`,
      ``,
      `text = "¡Hola! Me llamo Josefina y vivo en Madrid, España."`,
      `result = client.___([text])[0]`,
      ``,
      `print(f"Language   : {result.primary_language.name}")`,
      `print(f"ISO code   : {result.primary_language.iso6391_name}")`,
      `print(f"Confidence : {result.primary_language.confidence_score:.2f}")`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'TextAnalyticsClient', correct: true },
          {
            id: 'b',
            text: 'ContentUnderstandingClient',
            correct: false,
            why: 'That is the client for Azure Content Understanding, which analyses documents, images, audio and video.',
          },
          {
            id: 'c',
            text: 'AIProjectClient',
            correct: false,
            why: 'AIProjectClient connects to a Foundry project for models and agents. Azure Language features use TextAnalyticsClient.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'AzureKeyCredential', correct: true },
          {
            id: 'b',
            text: 'DefaultAzureCredential',
            correct: false,
            why: 'DefaultAzureCredential signs in with Microsoft Entra ID and takes no key. This code passes a key.',
          },
          {
            id: 'c',
            text: 'SpeechConfig',
            correct: false,
            why: 'SpeechConfig configures Azure Speech. It is not a credential.',
          },
        ],
      },
      {
        id: 'b3',
        options: [
          { id: 'a', text: 'detect_language', correct: true },
          {
            id: 'b',
            text: 'recognize_pii_entities',
            correct: false,
            why: 'It finds personal data. Its result has no primary_language.',
          },
          {
            id: 'c',
            text: 'analyze_sentiment',
            correct: false,
            why: 'It returns sentiment, not the language.',
          },
        ],
      },
    ],
    explanation:
      '`TextAnalyticsClient(endpoint=..., credential=AzureKeyCredential(key))` connects to Azure Language. `detect_language([text])` returns, for each text, a **primary_language** with its name, ISO 639-1 code and a confidence score.',
    reference: {
      label: 'Create a client application that analyzes text - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/3-language-sdk',
      quote:
        'The detect_language() method takes a list of text strings and returns the detected language, its ISO 639-1 code, and a confidence score between 0 and 1.',
    },
    tags: ['code', 'text-analysis', 'sdk'],
  },
  {
    id: 'code-ta-02',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: TEXT,
    difficulty: 'easy',
    kind: 'exam',
    prompt: 'What does `result.redacted_text` contain after this code runs?',
    code: py(
      `text = "Maria Garcia called from 020 7946 0958 and asked to send documents to 42 Market Road, London, UK, SW1A 1AA."`,
      ``,
      `result = client.recognize_pii_entities([text])[0]`,
      ``,
      `print("Redacted text:", result.redacted_text)`,
      `for entity in result.entities:`,
      `    print(f"  {entity.text} | category={entity.category} | confidence={entity.confidence_score}")`,
    ),
    options: [
      {
        id: 'a',
        text: 'The whole message, with the personal details such as the name, phone number and address masked',
        correct: true,
      },
      {
        id: 'b',
        text: 'Only the personal details that were found, as a list',
        correct: false,
        why: 'That list is `result.entities`. `redacted_text` is the whole message with those details masked.',
      },
      {
        id: 'c',
        text: 'The message translated into English',
        correct: false,
        why: 'PII detection does not translate. Translation is a separate service.',
      },
      {
        id: 'd',
        text: 'A one-sentence summary of the message',
        correct: false,
        why: 'Summarisation is a separate feature. PII detection keeps the text and masks the personal parts.',
      },
    ],
    explanation:
      '`recognize_pii_entities` gives you two things: **redacted_text**, the message with personal data masked, and **entities**, each with its text, category and confidence score.',
    reference: {
      label: 'Create a client application that analyzes text - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/3-language-sdk',
      quote:
        "The recognize_pii_entities() method identifies personal details in text and returns both the redacted version of the text and a list of the entities it found, including each entity's category and confidence score.",
    },
    tags: ['code', 'text-analysis', 'pii'],
  },
  {
    id: 'code-ta-03',
    topic: 'foundry-text-speech',
    moduleId: 'text-analysis',
    objective: TEXT,
    difficulty: 'medium',
    kind: 'exam',
    scenario:
      'The first version of an app sends each message to a deployed chat model with `client.responses.create()` and asks for its language code. Two calls with the same message sometimes return differently formatted answers.',
    prompt: 'The app needs the same structured result every time: a language code and a confidence score. What should it use?',
    options: [
      { id: 'a', text: "The Azure Language SDK's `detect_language()` method", correct: true },
      {
        id: 'b',
        text: 'A higher temperature on the chat model',
        correct: false,
        why: 'A higher temperature makes replies more varied, not more consistent.',
      },
      {
        id: 'c',
        text: "The Speech SDK's `SpeechRecognizer`",
        correct: false,
        why: 'SpeechRecognizer transcribes audio. These are text messages.',
      },
      {
        id: 'd',
        text: 'The `image_generation` tool',
        correct: false,
        why: 'It creates images. It has nothing to do with detecting a language.',
      },
    ],
    explanation:
      'A generative model writes its answer fresh each time, so the format can drift. When you need fixed, typed values such as a language code, a confidence score or redacted text, call the **Azure Language SDK**.',
    reference: {
      label: 'Create a client application that analyzes text - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-text-analysis-azure/3-language-sdk',
      quote:
        'When your app needs consistent, structured values, such as a language code, confidence score, or redacted text, the Azure Language SDK is a better choice.',
    },
    tags: ['code', 'text-analysis', 'sdk'],
  },

  /* ---------------- Content Understanding ---------------- */
  {
    id: 'code-cu-01',
    type: 'dropdown',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    prompt:
      'A Python app extracts fields from an invoice with Azure Content Understanding in Foundry Tools. Complete the code.',
    code: py(
      `client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key))`,
      ``,
      `analyzer_id = "prebuilt-invoice"`,
      `inputs = [{"url": invoice_url}]`,
      ``,
      `poller = client.___(analyzer_id=analyzer_id, inputs=inputs)`,
      `result = poller.___()`,
      ``,
      `for content in result.contents:`,
      `    print(content.markdown)`,
      `    print(content.fields)`,
    ),
    blanks: [
      {
        id: 'b1',
        options: [
          { id: 'a', text: 'begin_analyze', correct: true },
          {
            id: 'b',
            text: 'analyze_sentiment',
            correct: false,
            why: 'That is an Azure Language method for text, not Content Understanding.',
          },
          {
            id: 'c',
            text: 'recognize_once_async',
            correct: false,
            why: 'That is a Speech SDK method for transcribing audio.',
          },
        ],
      },
      {
        id: 'b2',
        options: [
          { id: 'a', text: 'result', correct: true },
          {
            id: 'b',
            text: 'wait',
            correct: false,
            why: 'wait() blocks until the operation finishes but returns nothing. result() waits and returns the analysis.',
          },
          {
            id: 'c',
            text: 'done',
            correct: false,
            why: 'done() only reports whether the operation has finished. It does not return the analysis.',
          },
        ],
      },
    ],
    explanation:
      'Analysis is **asynchronous**: `begin_analyze` starts a long-running operation and returns a poller, and `poller.result()` waits for it and returns the result. Each item in `result.contents` has the extracted **markdown** and **fields**.',
    reference: {
      label: 'Extract information from documents - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-information-extraction/2-documents',
      quote:
        "When you submit content for analysis to the analyzer, the analysis is asynchronous, which means you get the result later when it's ready.",
    },
    tags: ['code', 'content-understanding', 'sdk'],
  },
  {
    id: 'code-cu-02',
    type: 'yesno',
    topic: 'foundry-extraction',
    moduleId: 'information-extraction',
    objective: 'Build a lightweight application with information extraction capabilities by using Content Understanding',
    difficulty: 'medium',
    kind: 'exam',
    prompt: 'Review this Content Understanding code. Which of these statements are true?',
    code: py(
      `client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key))`,
      ``,
      `poller = client.begin_analyze(analyzer_id="prebuilt-invoice", inputs=[{"url": invoice_url}])`,
      `result = poller.result()`,
      ``,
      `for content in result.contents:`,
      `    print(content.fields)`,
    ),
    statements: [
      {
        id: 's1',
        text: 'begin_analyze starts the analysis and returns a poller, because the analysis runs asynchronously.',
        yes: true,
        why: 'Analysis is a long-running operation: you start it, then poll until it finishes.',
      },
      {
        id: 's2',
        text: 'poller.result() waits until the analysis has finished, then returns the result.',
        yes: true,
        why: 'The SDK does the polling for you and hands back the result.',
      },
      {
        id: 's3',
        text: 'prebuilt-invoice is a custom analyzer that you must create before this code can run.',
        yes: false,
        why: 'It is a prebuilt analyzer, ready to use. You only build a custom analyzer when no prebuilt one covers your fields.',
      },
    ],
    explanation:
      'Start with `begin_analyze`, wait with `poller.result()`, then read `result.contents`. Prebuilt analyzer ids such as **prebuilt-invoice** work straight away.',
    reference: {
      label: 'Extract information from documents - Microsoft Learn training',
      url: 'https://learn.microsoft.com/training/modules/get-started-information-extraction/2-documents',
      quote: 'Prebuilt analyzers include: prebuilt-invoice, prebuilt-imageSearch, prebuilt-audioSearch, and prebuilt-videoSearch.',
    },
    tags: ['code', 'content-understanding', 'sdk'],
  },
];
