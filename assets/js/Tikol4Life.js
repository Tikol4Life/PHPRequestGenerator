function generate(){
    var r_url = $("#r_url").val();
    var r_method = $("#r_method").val();
    var r_headers = $("#r_headers").val();
    var r_formdata = $("#r_formdata").val();

    if (r_url.length == 0 || r_method.length == 0 || r_headers.length == 0) {
        $('#Modal').modal('show');
        $('#ModalTitle').text("REQ GENERATOR");
        $('#ModalMsg').text("Error: Missing fields detected.");
        playError();
        return;
    }
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
