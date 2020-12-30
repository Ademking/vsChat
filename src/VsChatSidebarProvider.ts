import * as vscode from "vscode";
import * as path from "path";
import getWebviewContent from "./iframeView";
export class VsChatSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        // show vschat panel
        case "success": {
          this.openPanel(data);
          break;
        }
        case "error": {
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  // Make panel's title readable
  // 
  public prettifyPanelTitle(chatroomId: string) {
    switch (chatroomId) {
      case "vschat":
        return "#General";
      case "frontend":
        return "#FrontEnd";
      case "backend":
        return "#BackEnd";
      case "mobiledev":
        return "#MobileDev";
      case "data_science":
        return "#DataScience";
      case "devops":
        return "#DevOps";
      case "gamedev":
        return "#GameDev";
      case "frameworks":
        return "#Frameworks";
      default:
        return "#vsChat";
    }
  }

  public openPanel(data: any) {
    let username = data.username;
    let chatroomId = data.chatroomId;
    const panel = vscode.window.createWebviewPanel(
      "vsChat",
      this.prettifyPanelTitle(chatroomId),
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        enableCommandUris: true,
        enableFindWidget: true,
      }
    );
    panel.webview.html = getWebviewContent(username, chatroomId);
    panel.iconPath = vscode.Uri.joinPath(
      this._extensionUri,
      "img",
      "white-small.png"
    );
  }

  private getNonce() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				
				<title>vsChat</title>
			</head>
      <body>
      <div class="mylogo"></div>
      <h2>Welcome to vsChat</h2>
      <p>Chat with developers around the world.</p>
      
      <br>
				<label for="fname">Username:</label>
        <input type="text" id="username" name="username" placeholder="Your username">
        
        <label for="chatroom">Chatroom:</label>
        
          <select name="chatroom" id="chatroom">
            <option value="vschat">#General</option>
            <option value="frontend">#FrontEnd</option>
            <option value="backend">#BackEnd</option>
            <option value="mobiledev">#MobileDev</option>
            <option value="data_science">#DataScience</option>
            <option value="devops">#DevOps</option>
            <option value="gamedev">#GameDev</option>
            <option value="frameworks">#Frameworks</option>
          </select>
        <br>
        
        <h4>Rules</h4>
        <ul>
          <li>Be positive & helpful</li>
          <li>Be respectful</li>
          <li>Do not self promote</li>
          <li>Always be polite</li>
          <li>Have fun!</li>
        </ul>
        
        <br>
        
        <button id="enterBtn" class="bluebtn">Enter Chatroom 💬</button>
        <div class="greybtn"><a href="http://github.com/Ademking/vsChat">v0.0.5</a> | <a href="http://github.com/Ademking/vsChat">GitHub ⭐</a> | <a href="https://about.me/ademkouki">Contact 📧</a></div>
       
        <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
