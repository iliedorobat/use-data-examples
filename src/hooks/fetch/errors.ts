/**
 * The CustomAbortedError is used to track aborted http calls.
 *
 * E.g.:
 * const abortController = new AbortController();
 * useEffect(() => {
 *     // some code
 *     return () => {
 *         abortController.abort(new CustomAbortedError());
 *     };
 * }, []);
 */
class CustomAbortedError extends Error {
    constructor() {
        super('The API call has been canceled.');
        this.name = 'CustomAbortedError';
    }
}

export {
    CustomAbortedError
};
