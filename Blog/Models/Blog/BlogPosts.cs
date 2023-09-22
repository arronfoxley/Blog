using Newtonsoft.Json;
using System.Collections.Generic;

namespace Models.Blog{ 

    public class BlogPosts
    {

        [JsonProperty("blogPosts")]
        public List<BlogPost> Posts { get; set; } = new List<BlogPost>();
    }

}