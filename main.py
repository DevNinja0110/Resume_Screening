from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from libs.utils import extract_text_from_pdf
from libs.utils import extract_text_from_docx
from libs.utils import extract_text_from_doc
from libs.utils import get_score


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import List

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), job_description: str = Form(...)):
    try:
        scores = []
        for file in files:
            # Save the uploaded file
            file_location = f"files/{file.filename}"
            with open(file_location, "wb+") as file_object:
                file_object.write(file.file.read())

            # Extract text based on file type
            if file.filename.endswith(".pdf"):
                extracted_text = extract_text_from_pdf(file_location)
            elif file.filename.endswith(".docx"):
                extracted_text = extract_text_from_docx(file_location)
            elif file.filename.endswith(".doc"):
                extracted_text = extract_text_from_doc(file_location)
            else:
                return JSONResponse(content={"error": f"Unsupported file type: {file.filename}"}, status_code=400)
            
            score = get_score(job_description, extracted_text)
            # print(score)
            scores.append({"filename": file.filename, "score": score})
            
        return JSONResponse(content={"scores": scores})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)