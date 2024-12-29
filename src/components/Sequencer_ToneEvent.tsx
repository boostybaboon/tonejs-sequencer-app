import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const Sequencer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState('');
    const [currentLyric, setCurrentLyric] = useState('');
    const eventsRef = useRef<Tone.ToneEvent[]>([]);

    // Set the time signature to 6/8
    Tone.Transport.timeSignature = [6, 8];
    Tone.Transport.bpm.value = 180;

    const melodySequence = [
        { time: "0:0:0", note: "E4", duration: "8n", lyric: "three" },
        { time: "0:1:2", note: "D4", duration: "8n", lyric: "blind" },
        { time: "1:0:0", note: "C4", duration: "8n", lyric: "mice" },
        { time: "2:0:0", note: "E4", duration: "8n", lyric: "three" },
        { time: "2:1:2", note: "D4", duration: "8n", lyric: "blind" },
        { time: "3:0:0", note: "C4", duration: "8n", lyric: "mice" },
        { time: "4:0:0", note: "G4", duration: "8n", lyric: "see" },
        { time: "4:1:2", note: "F4", duration: "8n", lyric: "how" },
        { time: "4:2:2", note: "F4", duration: "8n", lyric: "they" },
        { time: "5:0:0", note: "E4", duration: "8n", lyric: "run" },
        { time: "6:0:0", note: "G4", duration: "8n", lyric: "see" },
        { time: "6:1:2", note: "F4", duration: "8n", lyric: "how" },
        { time: "6:2:2", note: "F4", duration: "8n", lyric: "they" },
        { time: "7:0:0", note: "E4", duration: "8n", lyric: "run" }
    ];

    useEffect(() => {
        const synth = new Tone.Synth().toDestination();

        // Create Tone.ToneEvent instances for each note in the sequence
        eventsRef.current = melodySequence.map(event => {
            return new Tone.ToneEvent((time) => {
                synth.triggerAttackRelease(event.note, event.duration, time);
                setCurrentLyric(event.lyric);
            }).start(event.time);
        });

        return () => {
            // Dispose of events when component unmounts
            eventsRef.current.forEach(event => event.dispose());
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isPlaying) {
            interval = setInterval(() => {
                setPosition(Tone.Transport.position.toString());
            }, 10);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    const startSequence = () => {
        if (isPlaying) {
            Tone.Transport.pause();
            setIsPlaying(false);
        } else {
            Tone.Transport.start();
            setIsPlaying(true);
        }
    };

    const rewindSequence = () => {
        Tone.Transport.position = "0:0:0";
        setPosition(Tone.Transport.position.toString());
        setCurrentLyric('');
    };

    return (
        <div>
            <button onClick={startSequence}>
                {isPlaying ? 'Pause Sequencer' : 'Start Sequencer'}
            </button>
            <button onClick={rewindSequence}>Rewind</button>
            <div>Position: {position}</div>
            <div>Lyric: {currentLyric}</div>
        </div>
    );
};

export default Sequencer;