import * as vscode from "vscode";
import * as path from "path";
import getWebviewContent from "./iframeView";
export class VsChatSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) { }

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

  public openPanel(data: any) {
    let username = data.value;
    const panel = vscode.window.createWebviewPanel(
      "vsChat",
      "Chatroom",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: false,
      }
    );
    panel.webview.html = getWebviewContent(username);
    panel.iconPath = vscode.Uri.joinPath(this._extensionUri, "img", "white-small.png");
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
        <button id="createBtn" class="bluebtn">Create Chatroom ➕ (in developing)</button>
        <button id="joinBtn" class="bluebtn">Join Chatroom ➡ (in developing)</button>
        <button id="enterBtn" class="bluebtn">Enter Chatroom 💬</button>
        <div class="greybtn"><a href="http://github.com/Ademking/vsChat">GitHub ⭐</a> | <a href="https://www.buymeacoffee.com/Ademkk">Buy me a coffee ☕</a></div>
       
        <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
