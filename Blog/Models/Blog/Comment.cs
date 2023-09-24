using System;
using System.Collections.Generic;
using System.Web.Services.Description;

namespace Models.Blog{ 

    public class Comment:Message
    {
        public Guid guid { get; set; }
        public List<CommentReply> commentReplies { get; set; } = new List<CommentReply>();
    }

}