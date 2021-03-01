export function main() {
    //@ts-ignore
    const vscode = acquireVsCodeApi();

    vscode.postMessage({ type: 'ready', text: 'ready' });

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const draw_ctx = canvas.getContext('2d');
    if (!draw_ctx) {
        return;
    }
    draw_ctx.fillStyle = 'black';
    draw_ctx.fillRect(0, 0, 512, 512);


    window.addEventListener('message', (e: any) => {
        const msg = e.data;
        switch (msg.command) {
            case 'draw_image': {
                console.log(`draw_image`);
                const uri = msg.data;
                console.log(`${uri}`);
                const image = new Image();
                image.src = uri;
                vscode.postMessage({ type: 'ready', text: 'image is loading' });
                image.onload = e => {
                    vscode.postMessage({ type: 'ready', text: 'image is loaded' });
                    draw_ctx.drawImage(image, 0, 0);
                };
                image.onerror = _ => {
                    vscode.postMessage({ type: 'ready', text: 'error' });
                };
                break;
            }
        }
    });
}