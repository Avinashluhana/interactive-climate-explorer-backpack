from fastapi import APIRouter
from utils.data_loader import load_dataset

router = APIRouter()

@router.get("/datasets")
def list_datasets():
    return ["IPCC", "IEA"]

@router.get("/datasets/{provider}")
def get_dataset(provider: str):
    data = load_dataset(provider)
    return data
