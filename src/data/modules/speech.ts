import type { Module } from '../types';

export const speech: Module = {
  id: 'speech',
  order: 10,
  title: 'Speech and spoken prompts',
  summary:
    'Recognition and synthesis, SSML, and the exam-relevant choice between a cascaded pipeline and a native multimodal audio model.',
  topic: 'foundry-text-speech',
  alsoCovers: ['ai-workloads'],
  minutes: 17,
  priority: 'medium',
  icon: '🎙️',
  outcomes: [
    'Tell recognition from synthesis and real-time from batch',
    'Say what SSML controls',
    'Justify a native multimodal audio model over a three-service cascade',
  ],
  quiz: ['wl-021', 'ts-009', 'sc-wl-04', 'sc-ts-02', 'sc-ts-03', 'sc-ts-06', 'sc-ts-08'],
  sections: [
    {
      id: 'directions',
      title: 'Which way is the audio flowing?',
      blocks: [
        {
          t: 'table',
          headers: ['Capability', 'Direction', 'Also known as'],
          rows: [
            ['**Speech recognition**', 'Audio → text', 'Speech to text, STT, ASR'],
            ['**Speech synthesis**', 'Text → audio', 'Text to speech, TTS'],
            ['**Speech translation**', 'Audio in one language → text or audio in another', '-'],
          ],
        },
        {
          t: 'table',
          headers: ['Recognition mode', 'Use it for'],
          rows: [
            ['**Real-time**', 'Live captions, voice assistants, streaming audio as it happens'],
            ['**Batch**', 'Large volumes of pre-recorded files in storage, processed asynchronously'],
          ],
        },
        { t: 'check', qid: 'wl-022' },
      ],
    },
    {
      id: 'ssml',
      title: 'SSML: controlling how it sounds',
      blocks: [
        {
          t: 'p',
          md: '**Speech Synthesis Markup Language** is an XML format for fine-grained control over synthesized speech. It applies to synthesis only - it has nothing to do with recognition.',
        },
        {
          t: 'code',
          lang: 'xml',
          caption: 'The tags worth recognising',
          code: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="-10%" pitch="+5Hz">Welcome to Microsoft Foundry.</prosody>
    <break time="500ms"/>
    <emphasis level="strong">How can I help today?</emphasis>
  </voice>
</speak>`,
        },
        {
          t: 'list',
          items: [
            '`<voice>` - which neural voice and language',
            '`<prosody>` - speaking rate, pitch, volume',
            '`<break>` - pauses, to the millisecond',
            '`<emphasis>` - stress on a phrase',
            '`<phoneme>` - force a specific pronunciation',
          ],
        },
        { t: 'check', qid: 'ts-006' },
      ],
    },
    {
      id: 'voices',
      title: 'Voices',
      blocks: [
        {
          t: 'table',
          headers: ['Option', 'What it is', 'Choose it when'],
          rows: [
            ['**Standard voices**', 'Hundreds of natural voices, including HD voices, across more than 150 locales', 'Almost always - this is the default'],
            ['**Professional voice** (custom voice)', 'A branded voice fine-tuned from studio recordings of a voice talent, with their recorded consent', 'You need a distinctive brand or character voice'],
            ['**Personal voice** (custom voice)', 'A replica of a user\'s own voice from a short sample', 'Users voice their own content, such as personalised narration'],
          ],
          caption: 'Both kinds of custom voice are Limited Access: you apply with an eligible use case first.',
        },
        { t: 'check', qid: 'ts-007' },
      ],
    },
    {
      id: 'multimodal',
      title: 'Cascade vs. native multimodal audio',
      blocks: [
        {
          t: 'p',
          md: '"Respond to spoken prompts by using a deployed multimodal model" is a named exam objective, so understand why you would choose it.',
        },
        {
          t: 'table',
          headers: ['', 'Cascade: STT → model → TTS', 'Native multimodal audio model'],
          rows: [
            ['Latency', 'Sum of three services', 'Single hop - fast enough for natural turn-taking'],
            ['Tone, emphasis, emotion', 'Lost at the transcription step', 'Preserved - the model hears the audio'],
            ['Control over each stage', 'Full - swap the voice, tune the transcript', 'Less granular'],
            ['Branded custom voice', 'Yes, via TTS', 'Constrained to the model\'s voices'],
          ],
        },
        {
          t: 'key',
          title: 'How to answer these',
          body: 'Latency, naturalness, or picking up on *how* something was said ⇒ **native multimodal**. Needing a specific branded voice, or control over the transcript itself ⇒ **cascade with Azure Speech**.',
          priority: 'high',
        },
        {
          t: 'changed',
          title: 'Foundry now packages both for you',
          body: '**Voice Live** is a fully managed speech-to-speech API with noise suppression, echo cancellation and turn detection built in. A **voice-based prompt agent** runs on it and lets you pick either architecture - a native realtime speech model such as the `gpt-realtime` family, or a cascade of speech recognition, a text model and speech synthesis - with no voice orchestration code of your own.',
        },
        { t: 'check', qid: 'ts-005' },
        { t: 'check', qid: 'wl-023' },
      ],
    },
    {
      id: 'client',
      title: 'A lightweight speech client',
      blocks: [
        {
          t: 'p',
          md: 'Both directions need the same three ingredients: **credentials and region**, an **audio source or destination**, and a **recognizer or synthesizer**.',
        },
        {
          t: 'code',
          lang: 'python',
          caption: 'Speech to text, then text to speech',
          code: `import os
import azure.cognitiveservices.speech as speechsdk

config = speechsdk.SpeechConfig(
    subscription=os.environ["SPEECH_KEY"],
    region=os.environ["SPEECH_REGION"],
)

# --- Recognition: audio in, text out ---
audio_in = speechsdk.audio.AudioConfig(filename="call.wav")
recognizer = speechsdk.SpeechRecognizer(speech_config=config, audio_config=audio_in)
result = recognizer.recognize_once_async().get()
if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("Heard:", result.text)

# --- Synthesis: text in, audio out ---
config.speech_synthesis_voice_name = "en-US-AvaNeural"
audio_out = speechsdk.audio.AudioOutputConfig(filename="reply.wav")
synthesizer = speechsdk.SpeechSynthesizer(speech_config=config, audio_config=audio_out)
synthesizer.speak_text_async("Your deployment is ready.").get()`,
        },
        { t: 'check', qid: 'ts-004' },
      ],
    },
    {
      id: 'vocab',
      title: 'Vocabulary that shows up',
      blocks: [
        {
          t: 'list',
          items: [
            '**Phoneme** - the smallest unit of sound that distinguishes words. "Cat" = /k/ /æ/ /t/.',
            '**Grapheme** - a written character. Synthesis converts graphemes to phonemes.',
            '**Sampling / sample rate** - digitising a continuous waveform; 16 kHz is a common speech standard.',
            '**Spectrogram** - audio frequencies plotted over time, often the input to acoustic models.',
            '**Speaker diarization** - labelling who spoke when.',
          ],
        },
        { t: 'check', qid: 'ts-011' },
      ],
    },
  ],
};
