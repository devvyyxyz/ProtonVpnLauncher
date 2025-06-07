const protonVpnUrl = "https://account.protonvpn.com/";

async function openOrSwitchToProtonVpn() {
  try {
    const tabs = await browser.tabs.query({});

    for (const tab of tabs) {
      if (tab.url && tab.url.includes(protonVpnUrl)) {
        // Switch to the ProtonVpn tab if found
        await browser.tabs.update(tab.id, { active: true });
        return;
      }
    }

    // Open a new ProtonVpn tab if none found
    browser.tabs.create({ url: protonVpnUrl });
  } catch (error) {
    console.error("Error in openOrSwitchToProtonVpn:", error);
  }
}

browser.browserAction.onClicked.addListener(openOrSwitchToProtonVpn);

// Add a context menu item
browser.contextMenus.create({
  id: "open-protonVpn",
  title: "Open ProtonVpn",
  contexts: ["browser_action"]
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "open-protonVpn") {
    openOrSwitchToProtonVpn();
  }
});

// Show a notification when the extension is installed
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icon128.png"),
      "title": "ProtonVpn Launcher Installed",
      "message": "To pin the icon, click the puzzle piece, right-click 'ProtonVpn Launcher', and select 'Pin to Toolbar'."
    });
  }
});