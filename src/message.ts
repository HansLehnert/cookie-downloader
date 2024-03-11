interface StorageItem {
    key: string,
    value: string,
}

export class GetLocalStorageRequest {
}

export class GetLocalStorageResponse {
    items: StorageItem[] = [];
}


export type Request = GetLocalStorageRequest;
export type Response = GetLocalStorageResponse;
