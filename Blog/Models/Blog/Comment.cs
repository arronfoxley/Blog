using System;
using System.Collections.Generic;

namespace Models.Blog{ 

    public class Comment
    {
        public Guid guid { get; set; }
        public string name { get; set; }
        public string date { get; set; }
        public string emailAddress { get; set; }
        public string message { get; set; }
        public List<CommentReply> commentReplies { get; set; } = new List<CommentReply>();
    }

}