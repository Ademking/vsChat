import * as vscode from "vscode";
import getWebviewContent from "./iframeView";
import * as path from "path";
import { VsChatSidebarProvider } from "./vsChatSidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const vsChatSidebarProvider = new VsChatSidebarProvider(context.extensionUri);

  let sidebar = vscode.window.registerWebviewViewProvider(
    "vschat-sidebar.view",
    vsChatSidebarProvider
  );

  context.subscriptions.push(sidebar);
}

export function deactivate() {}
