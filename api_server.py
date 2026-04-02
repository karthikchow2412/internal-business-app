from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Internal App Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


PRODUCTS = [
    {"id": 1, "name": "Cement Bag 50kg", "price": 380, "moq": 5},
    {"id": 2, "name": "Steel Rod 10mm", "price": 620, "moq": 3},
    {"id": 3, "name": "Wall Paint 20L", "price": 1150, "moq": 2},
    {"id": 4, "name": "Floor Tiles Box", "price": 890, "moq": 4},
]


@app.get("/products")
def get_products():
    return {"products": PRODUCTS}


if __name__ == "__main__":
    uvicorn.run("api_server:app", host="127.0.0.1", port=8000, reload=False)
