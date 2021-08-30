interface UserSchema {
    _id: string;
    agreement: boolean;
    group: string;
}

export const checkBadStatus = (res: Response) => {
    if (res.status >= 300) {
        const messages = ['Bad Request', 'Server Error'];
        const index = res.status >= 500;

        throw new Error(`${messages[Number(index)]}: ${res.status}`);
    }
};

export const fetchAgreement = async (userName: string): Promise<UserSchema> => {
    try {
        const fetchOptions = {
            method: 'GET',
        };
        const res = await fetch(`${process.env.BACKEND_HTTP}/users/agreement/one/${userName}`, fetchOptions);
        checkBadStatus(res);
        return await res.json();
    } catch (err) {
        return err;
    }
};

export const updateAgreement = async (userName: string): Promise<Response> => {
    try {
        const fetchOptions = {
            method: 'PUT',
        };
        const res = await fetch(`${process.env.BACKEND_HTTP}/users/agreement/update/${userName}`, fetchOptions);
        checkBadStatus(res);
        return await res.json();
    } catch (err) {
        return err;
    }
};
