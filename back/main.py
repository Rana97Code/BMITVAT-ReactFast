from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import engine, Base
from app.routes.auth_router import auth_router
from app.routes.user_router import user_router
from app.routes.country_route import country_router
from app.routes.relationship.customer_router import customer_router
from app.routes.relationship.supplier_router import supplier_router
from app.routes.general_settings.hscode_router import hscode_route
from app.routes.general_settings.unit_router import unit_router
from app.routes.inventory.opening_stock_router import router as opening_stock_router
from app.routes.inventory.item_router import item_route
from app.routes.production.local_purchase.purchase_route import router as purchase_router

Base.metadata.create_all(bind=engine)

def include_router(app):
    app.include_router(auth_router)
    app.include_router(user_router)
    app.include_router(country_router)
    app.include_router(customer_router)
    app.include_router(supplier_router)
    app.include_router(hscode_route)
    app.include_router(unit_router)
    app.include_router(item_route)
    app.include_router(opening_stock_router)
    
    app.include_router(purchase_router)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

def start_application():
    app = FastAPI()
    include_router(app)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middleware for security headers
    @app.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    return app

app = start_application()
