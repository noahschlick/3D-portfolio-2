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
            "title": "Texas State University",
            "period": "2019-2022",
            "description": "Bachelor's in Computer Science with a minor in Mathematics",
            "color": "#3b82f6",  # Blue
            "position": {"x": -2, "y": 0, "z": 0},
            "details": [
                "Bachelor's in Computer Science",
                "Minor in Mathematics",
                "Focus on Web Development and Software Engineering",
                "Relevant coursework: Data Structures, Algorithms, Database Systems",
                "Senior project: 3D Interactive Portfolio Website"
            ]
        },
        {
            "title": "Director at Icode Academy",
            "period": "2022-2023",
            "description": "Director of Icode Academy, overseeing curriculum and student engagement",
            "color": "#10b981",  # Green
            "position": {"x": 0, "y": 0, "z": 0},
            "details": [
                "Led curriculum development for coding bootcamps",
                "Managed team of 10+ instructors and staff",
                "Increased student engagement by 40%",
                "Developed new teaching methodologies",
                "Oversaw graduation of 200+ students"
            ]
        },
        {
            "title": "Web Developer for Shroom-Spy",
            "period": "2023-2024",
            "description": "Full Stack Developer for mushroom marketplace and community platform",
            "color": "#f59e0b",  # Amber
            "position": {"x": 2, "y": 0, "z": 0},
            "details": [
                "Built marketplace platform from ground up",
                "Implemented user authentication and payment systems",
                "Developed community features and forums",
                "Optimized performance for 10,000+ users",
                "Technologies: React, Node.js, MongoDB, Stripe API"
            ]
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
