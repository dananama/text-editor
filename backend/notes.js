import { update, get } from "@reshuffle/db";

/**
 * From the frontend we pass a newNote object conaining the id, color
 *  and about of the new Note. It then updates the Notes document by adding
 * latest newNote
 *
 * @param {Object} newNote - {id: {String}, color: {String}, about: {String}}
 *
 * @return {Object} - updated version of voteState
 */
// @expose
export async function addNotesToBackend(newNote) {
  return update("Notes", savedNotes => {
    const allNotes = { ...savedNotes };
    allNotes[newNote.id] = newNote;
    return allNotes;
  });
}

/**
 * @return {Array} of Objects - updated version of NoteState
 */
// @expose
export async function getNotes() {
  const notes = await get("Notes");
  let result = [];
  for (let note in notes) result.push(notes[note]);
  return result.reverse();
}

/**
 * Given the noteId that we want to delete, This function removes that
 * Note from the document and returns the updated document
 *
 * @param {String} noteId -
 *
 * @return {Object} - updated version of NoteState
 */
// @expose
export async function removeNote(noteId) {
  return update("Notes", savedNotes => {
    let allNotes = { ...savedNotes };
    delete allNotes[noteId];
    return allNotes;
  });
}
