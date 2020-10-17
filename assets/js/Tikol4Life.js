$(document).ready(function(){
    $("#r_results").text("");
});
function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
function generate(){
    var r_url = encodeHTML($("#r_url").val());
    var r_method = encodeHTML($("#r_method").val());
    var r_headers = encodeHTML($("#r_headers").val());
    var r_formdata = encodeHTML($("#r_formdata").val());

    if (r_url.length == 0 || r_method.length == 0 || r_headers.length == 0) {
        $('#Modal').modal('show');
        $('#ModalTitle').text("REQ GENERATOR");
        $('#ModalMsg').text("Error: Missing fields detected.");
        playError();
        return;
    }
    playClick();
    $("#r_results").text("$ch = curl_init();\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_URL, '"+ r_url +"');\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);\n");
    if(r_method == "POST"){
        $("#r_results").append("curl_setopt($ch, CURLOPT_POST, 1);\n");
    }else{
        $("#r_results").append("curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');\n");
    }
    $("#r_results").append("$headers = array();\n");
    var r_header = r_headers.split("\n");
    r_header.forEach(function(value, index) {
        $("#r_results").append("$headers[] = '"+value+"';\n");
    });
    $("#r_results").append("curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);\n");
    if (r_formdata.length != 0) {
        $("#r_results").append("curl_setopt($ch, CURLOPT_POSTFIELDS, '"+ r_formdata +"');\n");
    }
    $("#r_results").append("$curl = curl_exec($ch);\n");
    $("#r_results").append("curl_close($ch);\n");
    $("#r_results").append("echo $curl;");
    
    var x = document.getElementById("r_results_id");
    x.style.display = "block";
    var y = document.getElementById("code");
    y.style.display = "block";

}

function saveDynamicDataToFile() {
    var r_results = $("#r_results").text();
    if (r_results.length == 0) {
        $('#Modal').modal('show');
        $('#ModalTitle').text("REQ GENERATOR");
        $('#ModalMsg').text("Error: Generate first before saving.");
        playError();
        exit();
    }
    playClick();
    var userInput = "<?php\n//Req Generator Script by Tikol4Life\n\nvalue\n\n?>";
    var userInput = userInput.replace("value", r_results);
    var blob = new Blob([userInput], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "api.php");
}

function credits(){
    if(!$("#footer").length){
        $("#container").append('<div class="footer" id="footer"><center><p style="color: #FFFFFF">Tikol4Life</p></center></div>');
    }else{
    	var x = document.getElementById("footer").textContent;
    	if (x != 'Tikol4Life') {
    		$("#container").append('<div class="footer" id="footer"><center><p style="color: #FFFFFF">Tikol4Life</p></center></div>');
    	}
    }
}
function playClick() {
    var audio = document.getElementById("click");
    audio.play();
}
function playError() {
    var audio = document.getElementById("error");
    audio.play();
}
function playSuccess() {
    var audio = document.getElementById("success");
    audio.play();
}

/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this

function bom (blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false }
  else if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
var isMacOSWebView = /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
  // probably in some web worker
  (typeof window !== 'object' || window !== _global)
    ? function saveAs () { /* noop */ }

  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
  : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
  ? function saveAs (blob, name, opts) {
    var URL = _global.URL || _global.webkitURL
    var a = document.createElement('a')
    name = name || blob.name || 'download'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob
      if (a.origin !== location.origin) {
        corsEnabled(a.href)
          ? download(blob, name, opts)
          : click(a, a.target = '_blank')
      } else {
        click(a)
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
      setTimeout(function () { click(a) }, 0)
    }
  }

  // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator
  ? function saveAs (blob, name, opts) {
    name = name || blob.name || 'download'

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts)
      } else {
        var a = document.createElement('a')
        a.href = blob
        a.target = '_blank'
        setTimeout(function () { click(a) })
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name)
    }
  }

  // Fallback to using FileReader and a popup
  : function saveAs (blob, name, opts, popup) {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup || open('', '_blank')
    if (popup) {
      popup.document.title =
      popup.document.body.innerText = 'downloading...'
    }

    if (typeof blob === 'string') return download(blob, name, opts)

    var force = blob.type === 'application/octet-stream'
    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

    if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader()
      reader.onloadend = function () {
        var url = reader.result
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
        if (popup) popup.location.href = url
        else location = url
        popup = null // reverse-tabnabbing #460
      }
      reader.readAsDataURL(blob)
    } else {
      var URL = _global.URL || _global.webkitURL
      var url = URL.createObjectURL(blob)
      if (popup) popup.location = url
      else location.href = url
      popup = null // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
    }
  }
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}
