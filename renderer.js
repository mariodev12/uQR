// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {clipboard} = require('electron');
const clipboardEvent = require('electron-clipboard-extended')
const QRCode = require('qrcode')
const canvas = document.getElementById('canvas')

window.onload = () => {
    let currentClipboard = clipboard.readText();
    const isURL = isValidURL(currentClipboard)
    if (isURL) {
        document.querySelector('.title-domain').style.display = "block";
        document.querySelector('#canvas').style.display = "block";
        document.querySelector('.text-default').style.display = "none";
        getQR(currentClipboard)
        showdomain(currentClipboard)
    } else {
        document.querySelector('.title-domain').style.display = "none";
        document.querySelector('#canvas').style.display = "none";
        document.querySelector('.text-default').style.display = "block";
    }
}

const getQR = (text) => {
    QRCode.toCanvas(canvas, text, function (error) {
        if (error) console.error(error)
        console.log('success!');
    })
}

const parseURL = (url) => {
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url;

    protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    remaining_url = url.substr(protocol_i + 3, url.length);
    domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length ){
        case 2:
          parsed_url.subdomain = null;
          parsed_url.host = domain_parts[0];
          parsed_url.tld = domain_parts[1];
          break;
        case 3:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}

const showdomain = (text) => {
    const obj = parseURL(text)
    console.log(obj)
    document.querySelector('.title-domain').innerHTML = obj.host
}

const isValidURL = (string) => {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null)
    return false;
  else
    return true;
};


clipboardEvent.on('text-changed', () => {
    const text = clipboard.readText()
    const isURL = isValidURL(text)
    if (isURL) {
        document.querySelector('.title-domain').style.display = "block";
        document.querySelector('#canvas').style.display = "block";
        document.querySelector('.text-default').style.display = "none";
        getQR(text)
        showdomain(text)
    } else {
        document.querySelector('.title-domain').style.display = "none";
        document.querySelector('#canvas').style.display = "none";
        document.querySelector('.text-default').style.display = "block";
    }
}).startWatching();