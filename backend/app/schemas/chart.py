from pydantic import BaseModel
from typing import List

class ChartData(BaseModel):
    title: str
    categories: List[str]
    data: List[int]
