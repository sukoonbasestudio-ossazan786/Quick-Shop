
import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/gemini';

export const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTranscribing(true);
          const text = await transcribeAudio(base64Audio, 'audio/webm');
          setTranscription(text);
          setIsTranscribing(false);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscription('');
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-lg mb-12">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording 
              ? 'bg-rose-500 animate-pulse' 
              : 'bg-emerald-600 hover:bg-emerald-700'
            } text-white shadow-xl shadow-emerald-100`}
          >
            {isRecording ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h4 className="text-lg font-extrabold text-slate-900 mb-2">Voice Inquiry Support</h4>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">
            {isRecording 
              ? "Listening... Click to stop and transcribe." 
              : isTranscribing 
                ? "Sukoon AI is transcribing..." 
                : "Ask about a product or search using your voice. Click the microphone to start."}
          </p>
          
          {(isTranscribing || transcription) && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              {isTranscribing ? (
                <div className="flex gap-2 items-center text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Processing</span>
                </div>
              ) : (
                <p className="text-slate-800 text-sm italic">"{transcription}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
