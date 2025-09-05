import { AudioTrack } from '../types';

// NOTE: This is a MOCK service for demonstration.

const MOCK_TRACKS: AudioTrack[] = [
    { id: '1', title: 'Cyber Dream', artist: 'SynthWaveMaster', duration: 185, url: '', genre: 'Synthwave' },
    { id: '2', title: '8-Bit Adventure', artist: 'Pixel Perfect', duration: 150, url: '', genre: 'Chiptune' },
    { id: '3', title: 'Lo-Fi Chill', artist: 'Study Beats', duration: 210, url: '', genre: 'Lo-Fi' },
    { id: '4', title: 'Epic Orchestral', artist: 'CinemaSound', duration: 240, url: '', genre: 'Cinematic' },
];


export const searchTracks = (query: string): Promise<AudioTrack[]> => {
    console.log(`[AudioService] Searching for tracks with query: ${query}`);
    return new Promise(resolve => {
        setTimeout(() => {
            if (!query) {
                resolve(MOCK_TRACKS);
                return;
            }
            const results = MOCK_TRACKS.filter(track => 
                track.title.toLowerCase().includes(query.toLowerCase()) ||
                track.artist.toLowerCase().includes(query.toLowerCase())
            );
            resolve(results);
        }, 500);
    });
};
