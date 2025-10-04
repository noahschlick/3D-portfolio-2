from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routers import portfolio, blog

app = FastAPI(title="Portfolio Website", description="Lightweight portfolio with 3D elements")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="app/templates")

# Include routers
app.include_router(portfolio.router)
app.include_router(blog.router, prefix="/blog")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Main portfolio page with 3D elements and scroll animations"""
    portfolio_stages = [
        {
            "title": "Education",
            "period": "2018-2022",
            "description": "Computer Science Degree",
            "color": "#3b82f6",  # Blue
            "position": {"x": -2, "y": 0, "z": 0}
        },
        {
            "title": "First Job",
            "period": "2022-2023",
            "description": "Junior Developer",
            "color": "#10b981",  # Green
            "position": {"x": 0, "y": 0, "z": 0}
        },
        {
            "title": "Current Role",
            "period": "2023-Present",
            "description": "Full Stack Developer",
            "color": "#f59e0b",  # Amber
            "position": {"x": 2, "y": 0, "z": 0}
        }
    ]
    
    return templates.TemplateResponse("index.html", {
        "request": request,
        "portfolio_stages": portfolio_stages
    })

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
