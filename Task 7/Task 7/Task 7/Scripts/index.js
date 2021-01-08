var clarifaiApiKey = '4184da8857cc4f77acc54d06569c2f84';
var workflowId = 'General';


var app = new Clarifai.App({
    apiKey: clarifaiApiKey
});

// Handles image upload
function uploadImage() {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
        var imageData = reader.result;
        imageData = imageData.replace(/^data:image\/(.*);base64,/, '');
        predictFromWorkflow(imageData);
        getTotalAmt(imageData);

    }, false);

    if (file) {
        reader.readAsDataURL(file);
        preview.style.display = "inherit";
    }


}

function getTotalAmt(imageData) {

    let fileBLob = new Blob([document.querySelector('input[type=file]').files[0]], { type: 'text/plain' });
    var totalamt = $("totalamt-container");

    var data = new FormData();
    data.append('file', fileBLob); // This is file object

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var data = this.responseType;
            var serverResponse = JSON.parse(this.response);
            for (var i = 0; i < serverResponse.result[0].prediction.length; i++){
        if (serverResponse.result[0].prediction[i].label === "Total_Amount") {
            console.log(serverResponse.result[0].prediction[i].ocr_text)

          

            // Create heading for each section
            var newModelSection = document.createElement("div");
            newModelSection.className = "dsadasdsad" + " modal-container";

            var newModelHeader = document.createElement("h2");
            newModelHeader.innerHTML = "Total Amount" ;
            newModelHeader.className = "model-header";

            
            var newModelText = document.createElement("p");
            newModelText.innerHTML = "$ " + serverResponse.result[0].prediction[i].ocr_text;
            newModelText.className = "model-text";

            newModelSection.append(newModelHeader);
            newModelSection.append(newModelText);
            analysis.append(newModelSection);

        }
    }
           
        }
    });

    xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://app.nanonets.com/api/v2/OCR/Model/5ce25845-de50-4a84-b562-b8fe1c1d41fa/LabelFile/");

    xhr.setRequestHeader("authorization", "Basic " + btoa("ZM9uviBjE4gxZkz9m3AgqohZm9rhwaX6:"));

    xhr.send(data);



}

// Analyzes image provided with Clarifai's Workflow API
function predictFromWorkflow(photoUrl) {
    app.workflow.predict(workflowId, { base64: photoUrl }).then(
        function (response) {
            var outputs = response.results[0].outputs;
            var analysis = $(".analysis");



            analysis.empty();
            console.log(outputs);

            outputs.forEach(function (output) {
                var modelName = getModelName(output);

                // Create heading for each section
                var newModelSection = document.createElement("div");
                newModelSection.className = modelName + " modal-container";

                var newModelHeader = document.createElement("h2");
                newModelHeader.innerHTML = modelName;
                newModelHeader.className = "model-header";

                var formattedString = getFormattedString(output);
                var newModelText = document.createElement("p");
                newModelText.innerHTML = formattedString;
                newModelText.className = "model-text";

                newModelSection.append(newModelHeader);
                newModelSection.append(newModelText);
                analysis.append(newModelSection);
            });
        },
        function (err) {
            console.log(err);
        }
    );
}

// Helper function to get model name
function getModelName(output) {
    if (output.model.display_name !== undefined) {
        return output.model.display_name;
    } else if (output.model.name !== undefined) {
        return output.model.name;
    } else {
        return "";
    }
}

// Helper function to get output customized for each model
function getFormattedString(output) {
    var formattedString = "The thing we are most confident in detecting is:";
    var data = output.data;
    var maxItems = output.data.concepts.length;
    var items = data.concepts;
    for (var i = 0; i < maxItems; i++) {
        formattedString += "<br/>- " + items[i].name + " at a " + (Math.round(items[i].value * 10000) / 100) + "% probability";
    }

    return formattedString;
}