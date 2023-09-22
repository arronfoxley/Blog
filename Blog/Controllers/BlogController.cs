using Models.Blog;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Services.Description;

namespace Blog.Controllers
{
    public class BlogController : Controller
    {

        protected BlogPosts _blogPosts;

        protected static readonly string jsonPath = HostingEnvironment.MapPath(@"~/App_Data/Blog-Posts.json");
        public BlogController() {

            //Deserialzse to list
            _blogPosts = JsonConvert.DeserializeObject<BlogPosts>(System.IO.File.ReadAllText(jsonPath));

            //Check and convert dates
            _blogPosts.Posts.ForEach(blogPost => blogPost.comments.Where(comment =>comment.date.Length > 19).ToList().ForEach(comment => comment.date = DateTime.Parse(comment.date).ToString()));

            //Sort comments by date
           _blogPosts.Posts.ForEach(blogPost => blogPost.comments.Sort((x, y) => y.date.CompareTo(x.date)));


        }

        [Route("Blog/Index")]
        public ActionResult Index()
        {

            return View(GetBlogPostById(1));

        }

        [Route("Blog/BlogPost/{id}")]
        public ActionResult BlogPost(int id)
        {

            return View(GetBlogPostById(id));

        }

        [Route("Blog/BlogPost/{id}/CommentSubmitted")]
        public ActionResult CommentSubmitted(int id)
        {

            return View(GetBlogPostById(id));

        }

        [Route("Blog/BlogPost/{id}/ReplySubmitted")]
        public ActionResult ReplySubmitted(int id)
        {

            return View(GetBlogPostById(id));

        }

        /*[HttpPost]
        public ActionResult SubmitComment(string name, string emailAddress, string message, int blogPostId)
        {

            if(!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(emailAddress) && !string.IsNullOrEmpty(message)) {

                Comment comment = new Comment() { guid = Guid.NewGuid(), date = DateTime.Now, emailAddress = emailAddress, message = message, name = name };
                SaveComment(blogPostId, comment);

            }

            return RedirectToAction("CommentSubmitted", "Blog", new { id = blogPostId  });

        }*/

        /*[HttpPost]
        public ActionResult ReplyToComment(string name, string message, int blogPostId, Guid commentGuid)
        {

            Comment comment = GetBlogPostCommentByGUID(blogPostId, commentGuid);
            CommentReply reply = new CommentReply() { date = DateTime.Now, message = message, name = name };

            comment.commentReplies.Add(reply);

            string jsonString = JsonConvert.SerializeObject(_blogPosts);
            System.IO.File.WriteAllText(_jsonUrl, jsonString);

            return RedirectToAction("ReplySubmitted", "Blog", new { id = blogPostId});

        }*/

        [HttpPost]
        public ActionResult SubmitComment(string name, string emailAddress, string message, int blogPostId)
        {

            Comment comment = new Comment() { guid = Guid.NewGuid(), date = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"), emailAddress = emailAddress, message = message, name = name };
            SaveComment(blogPostId, comment);

            return Json(new { comment });

        }

        [HttpPost]
        public ActionResult ReplyToComment(string name, string message, int blogPostId, Guid commentGuid)
        {

            Comment comment = GetBlogPostCommentByGUID(blogPostId, commentGuid);
            CommentReply reply = new CommentReply() { date = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"), message = message, name = name };

            comment.commentReplies.Add(reply);

            string jsonString = JsonConvert.SerializeObject(_blogPosts);
            System.IO.File.WriteAllText(jsonPath, jsonString);

            return Json(new { comment, reply });

        }

        private void SaveComment(int blogPostId, Comment comment)
        {

            BlogPost blogPost = GetBlogPostById(blogPostId);
            blogPost.comments.Add(comment);

            string jsonString = JsonConvert.SerializeObject(_blogPosts);
            System.IO.File.WriteAllText(jsonPath, jsonString);

        }

        private BlogPost GetBlogPostById(int id)
        {

            return _blogPosts.Posts.First<BlogPost>(blogPost => blogPost.id == id);

        }

        private Comment GetBlogPostCommentByGUID(int blogPostId, Guid guid)
        {

            return GetBlogPostById(blogPostId).comments.First<Comment>(comment => comment.guid == guid);

        }

    }

}