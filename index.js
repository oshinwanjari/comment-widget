(function () {
  function Comment(userName, text, votes, commentList) {
    this.userName = userName;
    this.text = text;
    this.votes = votes;
    this.commentList = commentList;
  }

  Comment.prototype.like = function () {
    var commentList =
      JSON.parse(window.localStorage.getItem("commentList")) || [];
    this.votes = this.votes + 1;
    commentList = findAndUpdateComment(commentList, this);
    createCommentView(commentList);
  };
  console.log(Comment.prototype, "Comment");

  Comment.prototype.addComment = function (userName, text) {
    var newComment = new Comment(userName, text, 0, []);
    this.commentList.push(newComment);
  };

  Comment.prototype.save = function () {
    var commentList =
      JSON.parse(window.localStorage.getItem("commentList")) || [];
    commentList.push(this);
    createCommentView(commentList);
  };

  Comment.prototype.updateReplyList = function () {
    var commentList =
      JSON.parse(window.localStorage.getItem("commentList")) || [];
    // search for that comment in the list
    commentList = findAndUpdateComment(commentList, this);
    createCommentView(commentList);
  };

  Comment.prototype.delete = function () {
    var commentList =
      JSON.parse(window.localStorage.getItem("commentList")) || [];
    deleteComment(commentList, this);
  };

  function deleteComment(commentList, comment) {
    for (var i = 0; i < commentList.length; i++) {
      if (comment.text === commentList[i].text) {
        commentList.splice(i, 1);
      }
    }
    return commentList;
  }

  function findAndUpdateComment(commentList, comment) {
    for (var i = 0; i < commentList.length; i++) {
      if (
        commentList[i].text == comment.text &&
        commentList[i].userName == comment.userName
      )
        commentList[i] = comment;
      if (commentList[i].commentList.length > 0)
        findAndUpdateComment(commentList[i].commentList, comment);
    }
    return commentList;
  }

  function createCommentView(commentList) {
    var docFrag = document.createDocumentFragment();
    docFrag.appendChild(showComments(commentList));
    document.getElementById("viewComments").innerHTML = "";
    document.getElementById("viewComments").appendChild(docFrag);
    window.localStorage.setItem("commentList", JSON.stringify(commentList));
  }

  function createComment(userName, text, votes) {
    var comment = new Comment(userName, text, votes, []);
    comment.save();
    return comment;
  }

  function showComments(commentList) {
    var mainUL = document.createElement("ul");
    for (var i = 0; i < commentList.length; i++) {
      var comment = new Comment(
        commentList[i].userName,
        commentList[i].text,
        commentList[i].votes,
        commentList[i].commentList
      );
      var li = createLi(comment, i);
      mainUL.appendChild(li);
      if (commentList[i].commentList.length > 0) {
        mainUL.appendChild(showComments(commentList[i].commentList));
      }
    }
    return mainUL;
  }

  function createLi(comment, index) {
    // main li element
    var li = document.createElement("li");

    // main div for the li element
    var mainDiv = document.createElement("div");

    //commentDiv which will have comment and username
    var commentDiv = document.createElement("div");
    var commentNameAndText = document.createTextNode(
      comment.userName + ": " + comment.text
    );
    commentDiv.appendChild(commentNameAndText);

    // likes div which will have votes along with like
    var userLikes = document.createElement("div");
    var likes = document.createTextNode("Likes-- " + comment.votes);
    var likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.innerHTML = '<img src="/images/like.jpeg">';
    likeBtn.onclick = function () {
      comment.like();
    };
    userLikes.appendChild(likeBtn);
    userLikes.appendChild(likes);

    // nested comment username div
    var userNameDiv = document.createElement("div");
    var userName = document.createTextNode("Name: ");
    var nameInput = document.createElement("input");
    userNameDiv.appendChild(userName);
    userNameDiv.appendChild(nameInput);

    // nested comment comment div
    var nestedCommentDiv = document.createElement("div");
    var commentText = document.createTextNode("Comment: ");
    var commentInput = document.createElement("input");
    nestedCommentDiv.appendChild(commentText);
    nestedCommentDiv.appendChild(commentInput);

    //nested comment post button which will create a new comment

    var nestedCommentBtn = document.createElement("button");
    nestedCommentBtn.innerHTML = "Post comment";
    nestedCommentBtn.onclick = function () {
      var content = commentInput.value;
      var user = nameInput.value;
      var reply = new Comment(user, content, 0, []);
      comment.commentList.push(reply);
      comment.updateReplyList();
    };

    // nested comment Div which will show up on clicking add comment button on comment
    var replyDiv = document.createElement("div");

    var nestedReplyDiv = document.createElement("div");
    nestedReplyDiv.style.cssText = "display:none";
    nestedReplyDiv.appendChild(userNameDiv);
    nestedReplyDiv.appendChild(nestedCommentDiv);
    nestedReplyDiv.appendChild(nestedCommentBtn);

    var replyBtn = document.createElement("button");
    replyBtn.innerHTML = "Add Comment";
    replyBtn.onclick = function () {
      replyBtn.style.cssText = "display:none";
      nestedReplyDiv.style.cssText = "display:block";
    };
    replyDiv.appendChild(replyBtn);
    replyDiv.appendChild(nestedReplyDiv);

    var deleteCommentBtn = document.createElement("button");
    deleteCommentBtn.innerHTML = "Delete comment";
    deleteCommentBtn.onclick = function () {
      comment.delete();
    };

    mainDiv.appendChild(commentDiv);
    mainDiv.appendChild(userLikes);
    mainDiv.appendChild(replyDiv);
    mainDiv.appendChild(deleteCommentBtn);
    li.appendChild(mainDiv);
    return li;
  }

  document.getElementById("post").addEventListener("click", function () {
    var userName = document.getElementById("userName").value;
    var content = document.getElementById("commentBox").value;
    createComment(userName, content, 0);
  });

  var commentList =
    JSON.parse(window.localStorage.getItem("commentList")) || [];
  if (commentList.length) createCommentView(commentList);
})();
