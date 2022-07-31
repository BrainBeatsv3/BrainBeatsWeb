import {
	getNoteLengthStringFromInt,
	getInstrumentNameFromInt,
	getIntFromNoteTypeString,
	getIntFromNoteTypeStringWithMidiWriterJsValues,
	getNoteLengthMultiplier,
	getMilliecondsFromBPM,
	GetFloorOctave,
	findNumSamples,
	getFrequencyFromNoteOctaveString
} from './HelperFunctions.js';

const MidiWriter = require('midi-writer-js');

var trackFP1, trackFP2, trackC3, trackC4;

export function addNoteToMIDITrack(track, noteAndOctave, noteOctaveString, noteType)
{
    let note;
    if (noteAndOctave.note == -1) // Rest
        note = new MidiWriter.NoteEvent({wait: getIntFromNoteTypeStringWithMidiWriterJsValues(noteType).toString(), duration: '0', velocity: 0});
    else
        note = new MidiWriter.NoteEvent({pitch: [noteOctaveString], duration: getIntFromNoteTypeStringWithMidiWriterJsValues(noteType).toString()});

    if (track.contentHint === "FP1")
        trackFP1.addEvent(note);
    else if (track.contentHint === "FP2")
        trackFP2.addEvent(note);
    else if (track.contentHint === "C3")
        trackC3.addEvent(note);
    else if (track.contentHint === "C4")
        trackC4.addEvent(note);
}

export function initMIDIWriter(BPM)
{
    trackFP1 = new MidiWriter.Track();
    trackFP2 = new MidiWriter.Track();
    trackC3 = new MidiWriter.Track();
    trackC4 = new MidiWriter.Track();
    initMIDIWriterParams(BPM);
}

function initMIDIWriterParams(BPM)
{
    // Sets the tempo of each track to the song's tempo. There is currently no support for tempo changes nor tracks that have varying tempos
    trackFP1.setTempo(BPM);
    trackFP2.setTempo(BPM);
    trackC3.setTempo(BPM);
    trackC4.setTempo(BPM);

    // We currently only support the 4/4 time signature
    trackFP1.setTimeSignature(4, 4); 
    trackFP2.setTimeSignature(4, 4); 
    trackC3.setTimeSignature(4, 4); 
    trackC4.setTimeSignature(4, 4); 
}

export function printTrack(track)
{
    if (track == 1)
        console.log(trackFP1);
    else if (track == 2)
        console.log(trackFP2);
    else if (track == 3)
        console.log(trackC3);
    else if (track == 4)
        console.log(trackC4);
}

// Borrowed from https://stackoverflow.com/questions/3916191/download-data-url-file, thanks!!
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

function generateAndDownloadMIDIFile()
{
    var write = new MidiWriter.Writer([trackFP1, trackFP2, trackC3, trackC4]);
    var writeURI = write.dataUri();
    //COOOL TRICK
    //you can pass setState as a parameter and have it change in a different function
    setMIDIFile(writeURI)
    // pass writeURI to the database

    // downloadURI(writeURI, "BrainBeatsMasterpiece"); // <------------ this is where the MIDI file is actually generated
    // playMidiFile(writeURI);
    console.log("From the function:" + writeURI);
}

function generateMIDIURI()
{
    var write = new MidiWriter.Writer([trackFP1, trackFP2, trackC3, trackC4]);
    var writeURI = write.dataUri();
    return writeURI;
}