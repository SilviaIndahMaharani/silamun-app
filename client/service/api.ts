export const BACKEND = {
    BASE_URL: 'http://195.200.15.181:5006',
    headers: {
        accept: 'application/json',
    }
};

export const fetchGetAllSeagrass = async () => {
    const endpoint = `${BACKEND.BASE_URL}/lamun/get-data`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: BACKEND.headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch seagrass data');
    }

    const data = await response.json();

    return data;
};

export const uploadSeagrassImage = async (fileUri: string, fileName: string) => {
    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg',
    } as any);

    const response = await fetch(`${BACKEND.BASE_URL}/lamun/detect`, {
        method: 'POST',
        headers: {
            ...BACKEND.headers,
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to upload image');

    return json;
};