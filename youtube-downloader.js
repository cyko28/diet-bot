var ytdl = require('youtube-dl');

ytdl.exec('https://www.youtube.com/watch?v=a8c5wmeOL9o', ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
  if (err) throw err;
  console.log(output.join('\n'));
});