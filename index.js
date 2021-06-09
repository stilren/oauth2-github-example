var ClientOAuth2 = require('client-oauth2')
var express = require('express')
const axios = require('axios');

var app = express()
const port = 3000

var githubAuth = new ClientOAuth2({
  clientId: 'XXXXX',
  clientSecret: 'XXXXXX',
  accessTokenUri: 'https://github.com/login/oauth/access_token',
  authorizationUri: 'https://github.com/login/oauth/authorize',
  redirectUri: 'http://localhost:3000/auth/github/callback',
  scopes: ['notifications', 'gist']
})


app.get('/', (req, res) => {
    res.send('<html><body><a href="http://localhost:3000/auth/github">Auth Github</a></body></html>')
})

app.get('/auth/github', function (req, res) {
  var uri = githubAuth.code.getUri()
  res.redirect(uri)
})

app.get('/auth/github/callback', async (req, res) => {
  user = await githubAuth.code.getToken(req.originalUrl)
  axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}
  githubUser = await axios.get('https://api.github.com/user')
  return res.send(githubUser.data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})