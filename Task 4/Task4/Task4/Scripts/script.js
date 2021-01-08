$('#search').keyup(function () {
    var urlForCloudImage = "https://res.cloudinary.com/cscassignmentljk/image/upload/v1609770227/RareTalents/";

    var searchField = $('#search').val();
    var myExp = new RegExp(searchField, "i");
    var output = '<ul class="searchresults">';
    showSpinner();
    console.log("imhere")
    try {
        $.ajax({
            type: 'GET',
            url: '/api/talents'
        }).done(function (data) {
            $.each(data, function (key, val) {
                hideSpinner();
                if ((val.Name.search(myExp) != -1) ||
                    (val.Bio.search(myExp) != -1)) {
                    output += '<li>';
                    output += '<h2>' + val.Name + '</h2>';
                    output += '<img src=' + urlForCloudImage + val.ShortName + "_tn.jpg alt=" + val.Name + '" />';
                    output += '<p>' + val.Bio + '</p>';
                    output += '</li>';

                }
            })
            output += '</ul>';
            $('#update').html(output);

        }).fail(function (error) {
            output += "Error"
            output += '</ul>';
            $('#update').html(output);
            hideSpinner();
        });
    } catch {
        output += "Error"
        output += '</ul>';
        $('#update').html(output);
        hideSpinner();
    }
});



function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}
