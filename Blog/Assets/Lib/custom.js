//On successful reply submission, create a new reply element and append it to the target element
function ReplySuccess(data, formId) {

    var nameText = document.createTextNode(data['reply'].name);
    var dateText = document.createTextNode(data['reply'].date);
    var messageText = document.createTextNode(data['reply'].message);

    var parent = CreateDiv("media pt-4");

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

    ResetForm("replyForm" + formId);
    CreateMessageConfirmation("Reply successfully submitted", "#collapse" + formId);
}

//On successful comment submission, create a new comment element and append it to the target element
function CommentSuccess(data, targetElementId) {

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

    var a = CreateLink(targetElementId, "#" + targetElementId, "false", targetElementId);
    a.appendChild(linkText);

    content.appendChild(br);
    content.appendChild(a);

    $(parent).insertAfter("#commentFormContainer")

    ResetForm("commentForm");
    CreateMessageConfirmation("Comment successfully submitted", "#commentFormContainer");

}

function CreateLink(dataToggle, href, ariaExpanded, ariaControls) {

    var a = document.createElement("a");
    a.setAttribute("data-toggle", dataToggle);
    a.setAttribute("href", href);
    a.setAttribute("aria-expanded", ariaExpanded)
    a.setAttribute("aria-controls", ariaControls);

    return a;

}

//Reset the forms
function ResetForm(formId) {

    document.getElementById(formId).reset();
    
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

//Toggle reply\comment box link text 
$('a').on("click", function () {


    console.log($(this).text());

    if ($(this).hasClass("formLink")){

        if ($(this).text() == "Close Reply") {

            $(this).text("Reply");

        } else {

            $(this).text("Close Reply");

        }

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