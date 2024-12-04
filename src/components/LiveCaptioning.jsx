import React, { useEffect, useState } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const LiveCaptioning = () => {
  const [captions, setCaptions] = useState('');
  const [isCaptionsActive, setIsCaptionsActive] = useState(false);

  useEffect(() => {
    let audioStream = null;
    let recognizer = null;

    const startCaptioning = async () => {
      // Get user's microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Configure Azure Speech Service
      const speechConfig = speechsdk.SpeechConfig.fromSubscription('YOUR_SPEECH_API_KEY', 'YOUR_REGION');
      speechConfig.speechRecognitionLanguage = 'en-US'; // Set the language for transcription

      // Create an AudioConfig for real-time streaming
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();

      // Create a real-time recognizer
      recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      // Event handler for recognizing speech
      recognizer.recognizing = (sender, event) => {
        // Display partial transcriptions (real-time captions)
        setCaptions(event.result.text);
      };

      // Event handler when speech recognition completes
      recognizer.recognized = (sender, event) => {
        if (event.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          // Display final transcription result
          setCaptions(event.result.text);
        } else if (event.result.reason === speechsdk.ResultReason.NoMatch) {
          console.log('No speech could be recognized');
        }
      };

      // Event handler for errors
      recognizer.canceled = (sender, event) => {
        console.log('Speech Recognition canceled: ' + event.errorDetails);
      };

      // Start the speech recognition process
      recognizer.startContinuousRecognitionAsync();

      // Store audio stream in case we need to stop it later
      audioStream = stream;
      setIsCaptionsActive(true);
    };

    const stopCaptioning = () => {
      // Stop the recognition when done
      if (recognizer) {
        recognizer.stopContinuousRecognitionAsync();
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop()); // Stop the audio stream
      }
      setIsCaptionsActive(false);
    };

    return (
      <div>
        <h2>Live Captioning</h2>
        <button onClick={isCaptionsActive ? stopCaptioning : startCaptioning}>
          {isCaptionsActive ? 'Stop Captions' : 'Start Captions'}
        </button>
        <div className="captions">
          <p>{captions}</p>
        </div>
      </div>
    );
  }, [captions, isCaptionsActive]);

  return (
    <div>
      <h2>Real-Time Live Captioning</h2>
      <p>Start speaking to see captions appear in real time.</p>
      <div className="captions">{captions}</div>
    </div>
  );
};

export default LiveCaptioning;