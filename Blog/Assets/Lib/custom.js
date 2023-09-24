//On successful reply submission, create a new reply element and append it to the target element
function ReplySuccess(data, form) {

    var nameText = document.createTextNode(data['reply'].name);
    var dateText = document.createTextNode(data['reply'].date);
    var messageText = document.createTextNode(data['reply'].message);

    var parent = CreateDiv("media pt-4");

    var formId = form.id;

    var img = CreateImg("d-flex mr-3 rounded-circle user-avatar", "https://eu.ui-avatars.com/api/?name=" + data['reply'].name, data['reply'].name);
    parent.appendChild(img);

    var content = CreateDiv("media-body");

    parent.appendChild(content);

    var h5 = CreateH5("mt-0");
    h5.appendChild(nameText);

    content.appendChild(h5);

    var small = document.createElement("small");
    var em = document.createElement("em");

    em.appendChild(dateText);

    small.appendChild(em);
    h5.appendChild(small);

    content.appendChild(messageText);

    var target = document.getElementById("comment-" + data['comment'].guid);
    //target.insertBefore(parent, target.lastElementChild);

    $(parent).insertBefore(target.lastElementChild);

    ResetForm(form);

    CreateMessageConfirmation("Reply successfully submitted", '#'+formId);
}
//On successful comment submission, create a new comment element and append it to the target element
function CommentSuccess(data, form) {

    var messageText = document.createTextNode(data['comment'].message);
    var nameText = document.createTextNode(data['comment'].name);
    var dateText = document.createTextNode(data['comment'].date);
    var linkText = document.createTextNode("Reply");

    var parent = CreateDiv("media mb-4");

    var img = CreateImg("d-flex mr-3 rounded-circle user-avatar", "https://eu.ui-avatars.com/api/?name=" + data['comment'].name, data['comment'].name);
    parent.appendChild(img);

    var content = CreateDiv("media-body", "comment-" + data["comment"].guid);
    parent.appendChild(content);

    var h5 = CreateH5("mt-0");
    h5.appendChild(nameText);

    content.appendChild(h5);

    var small = document.createElement("small");
    var em = document.createElement("em");
    em.appendChild(dateText);

    small.appendChild(em);
    h5.appendChild(small);

    content.appendChild(messageText);

    var br = document.createElement("br");

    //var lastCollapseId = $('.collapse').last().attr('id');
    //var lastId = parseInt(lastCollapseId.replace("collapse", ""));
    //var nextId = lastId + 1;

    //var a = CreateLink("formLink", "collapse","#collapse" + nextId, "false", "collapse" + nextId);
    //a.appendChild(linkText);

    //content.appendChild(br);
    //content.appendChild(a);

    //var replyForm = CreateReplyForm("collapse" + nextId, parent, data['comment'].guid, data['blogPostId']);

    //$(replyForm).insertAfter($(a))

    $(parent).insertAfter($('#commentFormContainer'));

    ResetForm(form);
    CreateMessageConfirmation("Comment successfully submitted", "#commentFormContainer");

}
//Reset the forms
function ResetForm(form) {

    form.reset();
    
}
//Create Alert elements, pass alert message and target element Id
function CreateMessageConfirmation(alertMessage, targetElementId) {

    var parent = CreateDiv('alert alert-success alert-dismissible fade show');
    parent.setAttribute('role', 'Alert');

    var strong = document.createElement("strong");
    var alertText = document.createTextNode(alertMessage);
    strong.appendChild(alertText);

    parent.appendChild(strong);

    //document.getElementById("comments").insertBefore(parent, document.getElementById(targetElementId));
    $(parent).insertAfter(targetElementId)

    //Auto close timer
    setTimeout(function () {

        $('.alert').alert('close');

    },
        2000);

}
//Form submit override
$(".form").submit(function (e) {

    e.preventDefault();

    var actionUrl = $(this).attr('action');

    $.ajax({
        type: "POST",
        url: actionUrl,
        data: $(this).serialize(),
        success: function (data) {

            if (e.target.id == "commentForm") {

                CommentSuccess(data, e.target);

            } else {

                ReplySuccess(data, e.target);

            }

        }
    });

});
//On link click handler
$('a').on("click", function () {

    if ($(this).hasClass("formLink")) {

        //Toggle reply\comment box link text 
        if ($(this).text() == "Close Reply") {

            $(this).text("Reply");          

        } else {

            $(this).text("Close Reply");

        }

        //Scroll link and box into view
        $([document.documentElement, document.body]).animate({
            scrollTop: $(this).offset().top - ($(".navbar").height() + $(this).height())
        }, 1000);

    }

});
//Create elements
function CreateImg(classString, src, alt) {

    var img = document.createElement("img");
    img.setAttribute("class", classString);
    img.setAttribute("src", src);
    img.setAttribute("alt", alt);

    return img;

}
function CreateDiv(classString, id) {

    var div = document.createElement("div");
    div.setAttribute("id", id);
    div.setAttribute("class", classString);

    return div;

}
function CreateH5(classString) {

    var h5 = document.createElement("h5");
    h5.setAttribute("class", classString);

    return h5;

}
function CreateReplyForm(collapseId, commentHolder, commentGuid, blogPostId) {

var formAsString = '<div class="collapse" id="' + collapseId +'">'+
'<div class="card my-4">'+
'<h5 class="card-header">Reply to comment:</h5>'+
'<div class="card-body">'+
'<form id="@collapse" class="form" method="post" action="/Blog/ReplyToComment">'+
'<div class="form-row">'+
'<div class="form-group col-md-6'+
'<label for="Name">Name</label>'+
'<input name="name" type="text" class="form-control" id="name" placeholder="Name" required>'+
'</div>'+
'</div>'+
'<div class="form-group col-md-6">'+
'<label for="EmailAddress">Email Address</label>'+
'<input name="emailAddress" type="email" class="form-control" id="emailAddress" placeholder="Email Address" required>'+
'</div>'+
'<div class="form-group">'+
'<label for="Message">Message</label>'+
'<textarea name="message" id="message" class="form-control" rows="3" required></textarea>'+
'</div>'+
'<input type="hidden" id="blogPostId" name="blogPostId" value="' + blogPostId + '">' +
'<input type="hidden" id="commentGuid" name="commentGuid" value="' + commentGuid + '">' +
'<button type="submit" class="btn btn-primary">Submit</button>'+
'</form>'+
'</div>'+
'</div>'+
'</div>'

    return $($.parseHTML(formAsString));

}
function CreateLink(classString, dataToggle, href, ariaExpanded, ariaControls) {

    var a = document.createElement("a");
    a.setAttribute("class", classString);
    a.setAttribute("data-toggle", dataToggle);
    a.setAttribute("href", href);
    a.setAttribute("aria-expanded", ariaExpanded)
    a.setAttribute("aria-controls", ariaControls);

    return a;

}
