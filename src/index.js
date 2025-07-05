export default {
  async fetch(request) {
    const url = new URL(request.url);
    const getParam = (name) => url.searchParams.get(name);

    const images = [];
    let i = 1;
    while (getParam('img' + i)) {
      images.push(getParam('img' + i));
      i++;
    }

    const width = parseInt(getParam('w'), 10);
    const height = parseInt(getParam('h'), 10);
    const interval = parseInt(getParam('interval'), 10);
    const rows = parseInt(getParam('r'), 10);
    const cols = parseInt(getParam('c'), 10);

    if (!images.length || isNaN(width) || isNaN(height) || isNaN(interval) || isNaN(rows) || isNaN(cols)) {
      return new Response("Missing required parameters", { status: 400 });
    }

    let vttContent = "WEBVTT\n\n";
    let currentTime = 0;
    const totalSprites = rows * cols;

    for (let imgIdx = 0; imgIdx < images.length; imgIdx++) {
      let spriteCount = 0;
      let x = 0;
      let y = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (spriteCount >= totalSprites) break;

          const start = new Date(currentTime * 1000).toISOString().substr(11, 8) + '.000';
          const end = new Date((currentTime + interval) * 1000).toISOString().substr(11, 8) + '.000';

          vttContent += `${start} --> ${end}\n`;
          vttContent += `${images[imgIdx]}#xywh=${x},${y},${width},${height}\n\n`;

          currentTime += interval;
          spriteCount++;
          x += width;
        }
        x = 0;
        y += height;
      }
    }

    return new Response(vttContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  }
};
