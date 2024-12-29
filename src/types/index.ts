export interface SequenceConfig {
    tempo: number;
    notes: Array<{
        pitch: string;
        duration: number;
        time: number;
    }>;
}

export interface SequencerEvent {
    type: 'start' | 'stop' | 'update';
    timestamp: number;
    data?: any;
}