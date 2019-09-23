import { update, get } from "@reshuffle/db";

/**
 *
 * @param {Object}
 *
 * @return {Object}
 */
// @expose
export async function addDocToBackend(newDoc) {
  return update("docs", savedDocs => {
    const allDocs = { ...savedDocs };
    if (allDocs.hasOwnProperty(newDoc.id)) {
      allDocs[newDoc.id] = newDoc;
      return allDocs;
    } else {
      allDocs[newDoc.id] = newDoc;
      return allDocs;
    }
  });
}

/**
 * @return {Array} of Objects -
 */
// @expose
export async function getDocs() {
  const docs = await get("docs");
  let result = [];
  for (let doc in docs) result.push(docs[doc]);
  return result.reverse();
}

/**
 *
 * @param {String} docId -
 *
 * @return {Object} -
 */
// @expose
export async function removeDoc(docId) {
  return update("docs", savedDocs => {
    let allDocs = { ...savedDocs };
    delete allDocs[docId];
    return allDocs;
  });
}
