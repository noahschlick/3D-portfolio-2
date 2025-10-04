from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/portfolio-stage/{stage_id}", response_class=HTMLResponse)
async def get_portfolio_stage(request: Request, stage_id: int):
    """Return detailed view of a portfolio stage via HTMX"""
    stages = {
        0: {
            "title": "Education",
            "period": "2018-2022",
            "description": "Computer Science Degree",
            "details": [
                "Bachelor's in Computer Science",
                "Focus on Web Development and AI",
                "Graduated Magna Cum Laude",
                "Relevant coursework: Data Structures, Algorithms, Web Development"
            ]
        },
        1: {
            "title": "First Job",
            "period": "2022-2023",
            "description": "Junior Developer",
            "details": [
                "Developed responsive web applications",
                "Worked with React and Node.js",
                "Collaborated in Agile development teams",
                "Contributed to open source projects"
            ]
        },
        2: {
            "title": "Current Role",
            "period": "2023-Present",
            "description": "Full Stack Developer",
            "details": [
                "Lead development of multiple projects",
                "Expertise in Python, FastAPI, and React",
                "Mentoring junior developers",
                "Implementing CI/CD pipelines"
            ]
        }
    }
    
    stage = stages.get(stage_id, {})
    return templates.TemplateResponse("portfolio_stage.html", {
        "request": request,
        "stage": stage,
        "stage_id": stage_id
    })
