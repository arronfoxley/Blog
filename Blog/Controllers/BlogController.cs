using Models.Blog;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Web.Hosting;
using System.Web.Mvc;

namespace Blog.Controllers
{
    public class BlogController : Controller
    {

        protected BlogModel _blogModel;

        protected static readonly string jsonPath = HostingEnvironment.MapPath(@"~/App_Data/Blog-Posts.json");
        public BlogController() {

            _blogModel = new BlogModel();

            //Deserialzse to list
            _blogModel.BlogPosts = JsonConvert.DeserializeObject<BlogPosts>(System.IO.File.ReadAllText(jsonPath));

            //Check and convert dates
            _blogModel.BlogPosts.Posts.ForEach(blogPost => blogPost.comments.Where(comment =>comment.date.Length > 19).ToList().ForEach(comment => comment.date = DateTime.Parse(comment.date).ToString()));

            //Sort comments by date
            _blogModel.BlogPosts.Posts.ForEach(blogPost => blogPost.comments.Sort((x, y) => x.date.CompareTo(y.date)));


        }

        [Route("Blog/Index")]
        public ActionResult Index()
        {

            _blogModel.SelectedBlogPost = _blogModel.BlogPosts.Posts[0];
            return View(_blogModel);

        }

        [Route("Blog/BlogPosts/{id}")]
        public ActionResult BlogPost(int id)
        {
            _blogModel.SelectedBlogPost = _blogModel.BlogPosts.Posts[id];
            return View(_blogModel);
        }

        [Route("Blog/BlogPosts/{id}/CommentSubmitted")]
        public ActionResult CommentSubmitted(int id)
        {

            _blogModel.SelectedBlogPost = _blogModel.BlogPosts.Posts[id];
            return View(_blogModel);

        }

        [Route("Blog/BlogPosts/{id}/ReplySubmitted")]
        public ActionResult ReplySubmitted(int id)
        {

            _blogModel.SelectedBlogPost = _blogModel.BlogPosts.Posts[id];
            return View(_blogModel);

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

            return Json(new { comment, blogPostId });

        }

        [HttpPost]
        public ActionResult ReplyToComment(string name, string emailAddress, string message, int blogPostId, Guid commentGuid)
        {

            Comment comment = GetBlogPostCommentByGUID(blogPostId, commentGuid);
            CommentReply reply = new CommentReply() { date = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"), emailAddress = emailAddress, message = message, name = name };

            comment.commentReplies.Add(reply);

            string jsonString = JsonConvert.SerializeObject(_blogModel.BlogPosts);

            SaveToFile(jsonString);

            return Json(new { comment, reply });

        }

        private void SaveComment(int blogPostId, Comment comment)
        {

            BlogPost blogPost = GetBlogPostById(blogPostId);
            blogPost.comments.Add(comment);

            string jsonString = JsonConvert.SerializeObject(_blogModel.BlogPosts);

            SaveToFile(jsonString);

        }

        private void SaveToFile(string jsonString)
        {

            System.IO.File.WriteAllText(jsonPath, jsonString);

        }

        private BlogPost GetBlogPostById(int id)
        {

            return _blogModel.BlogPosts.Posts.First<BlogPost>(blogPost => blogPost.id == id);

        }

        private Comment GetBlogPostCommentByGUID(int blogPostId, Guid guid)
        {

            return GetBlogPostById(blogPostId).comments.First<Comment>(comment => comment.guid == guid);

        }

    }

}