import { Buffer } from 'buffer'
import { GetLocalStorageRequest, GetLocalStorageResponse } from "./message";


async function getLocalStorageData(tab_id: number) {
    const response: GetLocalStorageResponse = await chrome.tabs.sendMessage(
        tab_id, new GetLocalStorageRequest);

    let local_storage_values: any = {}
    for (let item of response.items) {
        local_storage_values[item.key] = item.value
    }

    return JSON.stringify(local_storage_values);
}


chrome.action.onClicked.addListener(
    async (tab: chrome.tabs.Tab) => {
        if (tab.url == undefined) {
            console.error("Tab URL is undefined.");
            return;
        }

        let cookies = await chrome.cookies.getAll({url: tab.url});

        function addMetaCookie(name: string, value: string) {
            cookies.push({
                domain: "__meta",
                hostOnly: true,
                path: "/",
                secure: false,
                expirationDate: 0,
                name: name,
                value: value,
                storeId: "",
                session: false,
                httpOnly: false,
                sameSite: "unspecified",
            });
        }

        addMetaCookie("__user_agent", navigator.userAgent);
        addMetaCookie("__localstorage", await getLocalStorageData(tab.id!));

        let formatted_cookies: string = "# HTTP Cookie File\n";
        for (let cookie of cookies) {
            const cookie_values: string[] = [
                cookie.domain,                              // host
                cookie.hostOnly ? "FALSE" : "TRUE",         // subdomains
                cookie.path,                                // path
                cookie.secure ? "TRUE" : "FALSE",           // isSecure
                (cookie.expirationDate ?? 0).toString(),    // expiry
                cookie.name,                                // name
                cookie.value,                               // value
            ];
            formatted_cookies += cookie_values.join("\t") + "\n";
        }

        const data_url = URL.createObjectURL(
            new Blob([formatted_cookies], {type: 'text/plain'}));

        const domain_name = new URL(tab.url).hostname.split('.').at(-2);
        const filename = domain_name + "_cookies.txt";

        await browser.downloads.download({
            url: data_url,
            filename: filename,
            conflictAction: "overwrite",
        });
    }
)
