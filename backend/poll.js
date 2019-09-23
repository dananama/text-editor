import { update } from "@reshuffle/db";

/**
 * Given a dictionary of vote-label->vote-count pairs, updates
 * the backend state by merging the new vote counts with the
 * existing vote tally.
 *
 * @param {Object} voteState - dictionary that holds options for voting
 *                 and their respective counts.
 *
 * @return {Object} - updated version of voteState
 */
// @expose
export async function addVotesToBackend(voteState) {
  return update("pollVotes", (savedVotes = {}) => {
    const allVotes = { ...savedVotes };
    voteState.forEach(({ label, checked }) => {
      if (!Object.prototype.hasOwnProperty.call(allVotes, label)) {
        allVotes[label] = 0;
      }
      allVotes[label] += checked ? 1 : 0;
    });
    return allVotes;
  });
}

// @expose
export async function hello(voteState) {
  return "Hello" + voteState;
}
