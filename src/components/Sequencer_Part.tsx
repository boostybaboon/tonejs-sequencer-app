import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const Sequencer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState('');
    const [currentLyric, setCurrentLyric] = useState('');
    const melodyPartRef = useRef<Tone.Part | null>(null);
    const shakerLoopRef = useRef<Tone.Loop | null>(null);

    // Set the time signature to 6/8
    Tone.getTransport().timeSignature = [6, 8];
    Tone.getTransport().bpm.value = 180;

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
        let interval: NodeJS.Timeout | undefined;
        if (isPlaying) {
            interval = setInterval(() => {
                setPosition(Tone.getTransport().position.toString());
            }, 10);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    useEffect(() => {
        const synth = new Tone.Synth().toDestination();
        const shaker = new Tone.NoiseSynth({
            noise: {
                type: 'white'
            },
            envelope: {
                attack: 0.05,
                decay: 0.2,
                sustain: 0
            }
        }).toDestination();

        shaker.volume.value = -12; // Adjust this value as needed

        melodyPartRef.current = new Tone.Part((time, value) => {
            synth.triggerAttackRelease(value.note, value.duration, time);
            setCurrentLyric(value.lyric);
        }, melodySequence);

        shakerLoopRef.current = new Tone.Loop((time) => {
            shaker.triggerAttackRelease('8n', time);
        }, '8n');

        return () => {
            melodyPartRef.current?.dispose();
            shakerLoopRef.current?.dispose();
        };
    }, []);

    const startSequence = () => {
        if (isPlaying) {
            Tone.getTransport().pause();
            setIsPlaying(false);
        } else {
            if (Tone.getTransport().state === 'stopped') {
                melodyPartRef.current?.start(0);
                shakerLoopRef.current?.start(0);
            }
            Tone.getTransport().start();
            setIsPlaying(true);
        }
    };

    const rewindSequence = () => {
        Tone.getTransport().position = "0:0:0";
        setPosition(Tone.getTransport().position.toString());
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