from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/blog", response_class=HTMLResponse)
async def blog_list(request: Request):
    """Blog listing page"""
    return templates.TemplateResponse("blog.html", {"request": request})

@router.get("/blog/posts", response_class=HTMLResponse)
async def get_blog_posts(request: Request, page: int = 1):
    """Get blog posts via HTMX for pagination"""
    # Mock blog posts data
    posts = [
        {
            "id": 1,
            "title": "Building a Lightweight Portfolio",
            "excerpt": "How I created this portfolio using FastAPI and Three.js",
            "date": "2024-01-15",
            "tags": ["Python", "FastAPI", "Three.js"]
        },
        {
            "id": 2,
            "title": "3D Web Experiences",
            "excerpt": "Creating interactive 3D elements for the web",
            "date": "2024-01-10",
            "tags": ["Three.js", "WebGL", "JavaScript"]
        },
        {
            "id": 3,
            "title": "HTMX and Modern Web Development",
            "excerpt": "Why HTMX is perfect for lightweight interactive websites",
            "date": "2024-01-05",
            "tags": ["HTMX", "Web Development", "Performance"]
        }
    ]
    
    return templates.TemplateResponse("blog_posts.html", {
        "request": request,
        "posts": posts,
        "page": page
    })

@router.get("/blog/{post_id}", response_class=HTMLResponse)
async def get_blog_post(request: Request, post_id: int):
    """Get individual blog post"""
    # Mock post data
    post = {
        "id": post_id,
        "title": "Sample Blog Post",
        "content": "This is the content of the blog post...",
        "date": "2024-01-15",
        "tags": ["Python", "Web Development"]
    }
    
    return templates.TemplateResponse("blog_post.html", {
        "request": request,
        "post": post
    })
