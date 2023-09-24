using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Models.Blog {
    public class Message {
        public string name { get; set; }
        public string date { get; set; }
        public string emailAddress { get; set; }
        public string message { get; set; }
    }
}