using System.Collections.Generic; 
using System;

namespace Models.Blog{ 

    public class BlogPost
    {
        public int id { get; set; }
        public DateTime date { get; set; }
        public string title { get; set; }
        public string image { get; set; }
        public string htmlContent { get; set; }
        public List<Comment> comments { get; set; } = new List<Comment>();

    }

}