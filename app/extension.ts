import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let webview: vscode.Webview;
	let disposable = vscode.commands.registerCommand('cot-vs-ext.test1', () => {
		// 创建并显示新的webview
		const panel = vscode.window.createWebviewPanel(
			'cot',
			'cot',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		panel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				case 'ready':
					vscode.window.showInformationMessage(e.text);
					break;
			}
		});

		webview = panel.webview;
		webview.html = getWebviewContent(context, webview);
	});

	let test = vscode.commands.registerCommand('cot-vs-ext.test2', () => {
		const sand = webview.asWebviewUri(vscode.Uri.joinPath(
			context.extensionUri, 'assets', 'sand.jpg'
		));
		webview.postMessage({ command: 'draw_image', data: `${sand}` });
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(test);
}

function getWebviewContent(ctx: vscode.ExtensionContext, webview: vscode.Webview): string {
	const require_uri = webview.asWebviewUri(vscode.Uri.joinPath(
		ctx.extensionUri, 'out', 'cot-render', 'r.js'
	));

	const script_uri = webview.asWebviewUri(vscode.Uri.joinPath(
		ctx.extensionUri, 'out', 'cot-render', 'lib.js'
	));

	return `
		  <!DOCTYPE html>
		  <html lang="en">
		    <head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <title>Test</title>
		    </head>
		    <body>
			  <canvas id="canvas" width="512" height="512"></canvas>
			  <script src="${require_uri}"></script>
			  <script src="${script_uri}"></script>
			  <script>
			    require(['lib'], function(app) {
					app.main();
				})
			  </script>
		    </body>
		  </html>
	  		`;
}

export function deactivate() { }
