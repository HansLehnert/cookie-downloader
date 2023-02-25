chrome.action.onClicked.addListener(
    async (tab: chrome.tabs.Tab) => {
        if (tab.url == undefined) {
            console.error("Tab URL is undefined.");
            return;
        }

        const cookies = await chrome.cookies.getAll({url: tab.url});

        // await chrome.downloads.download(
        //     {"conflictAction": "overwrite",
        //         "filename": "cookies.txt"
        //     }
        // );

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

        const data_url = "data:text/plain;base64," + btoa(formatted_cookies);

        await chrome.downloads.download({
            url: data_url,
            filename: "cookies.txt",
            conflictAction: "overwrite",
        })
    }
)
