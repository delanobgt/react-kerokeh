export const goPromise = async <T>(promise :Promise<T>) : Promise<[any, T | undefined]> => {
    try {
        const res = await promise;
        return [null, res];
    } catch (error) {
        return [error, undefined];
    }
}

