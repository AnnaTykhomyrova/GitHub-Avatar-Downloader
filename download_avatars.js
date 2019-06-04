var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${secrets.GITHUB_TOKEN}`
    }
  };

  request(options, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var data = JSON.parse(body);
      cb(err, data);
    } else {
      cb(err, body);
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)    // Note 1
   .on('error', function (err) {                                   // Note 2
     throw err;
   })
   .on('response', function (response) {                           // Note 3
     console.log('Response Status Code: ', response.statusCode);
     console.log('Downloading image...');
   })
   .pipe(fs.createWriteStream(`./avatars/${filePath}.jpg`))
   .on('finish', function () {
    console.log('Download complete.');
 });
}


getRepoContributors("lighthouse-labs", "laser_shark", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  result.forEach((element) => {
    downloadImageByURL(element.avatar_url, element.login);
  });
});
