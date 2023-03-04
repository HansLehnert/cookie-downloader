chrome.action.onClicked.addListener(
    async (tab: chrome.tabs.Tab) => {
        if (tab.url == undefined) {
            console.error("Tab URL is undefined.");
            return;
        }

        let cookies = await chrome.cookies.getAll({url: tab.url});

        cookies.push({
            domain: "__meta",
            hostOnly: true,
            path: "/",
            secure: false,
            expirationDate: 0,
            name: "user_agent",
            value: navigator.userAgent,
            storeId: "",
            session: false,
            httpOnly: false,
            sameSite: "unspecified",
        });

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

        const domain_name = new URL(tab.url).hostname.split('.').at(-2);
        const filename = domain_name + "_cookies.txt";

        await chrome.downloads.download({
            url: data_url,
            filename: filename,
            conflictAction: "overwrite",
        })
    }
)
