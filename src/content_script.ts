
import { GetLocalStorageResponse, Request } from "./message"


function handleMessage(
    request: Request,
    sender: chrome.runtime.MessageSender,
    send_response: (response?: any) => void) {

    let response = new GetLocalStorageResponse();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key!);
        response.items.push({key: key!, value: value!});
    }

    send_response(response);
}


chrome.runtime.onMessage.addListener(handleMessage);
