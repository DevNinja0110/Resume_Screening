import fitz  # PyMuPDF
from docx import Document
import os
import win32com.client
import json
from openai import OpenAI


from dotenv import load_dotenv
load_dotenv()

def extract_text_from_doc(doc_path):
    text = ""
    try:
        word = win32com.client.Dispatch("Word.Application")
        doc = word.Documents.Open(doc_path)
        text = doc.Content.Text
        print(text)
        doc.Close()
        word.Quit()
    except Exception as e:
        print(f"Error reading DOC file: {e}")
    return text

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        document = fitz.open(pdf_path)
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            text += page.get_text()
    except Exception as e:
        print(f"Error reading PDF file: {e}")
    return text

def extract_text_from_docx(docx_path):
    text = ""
    try:
        document = Document(docx_path)
        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"
        
    except Exception as e:
        print(f"Error reading DOCX file: {e}")
    return text


def get_score(job_description, resume):
    try:
        prompt = f"""You are a professional HR recruiter and your job is to give Score to a prospect based on the
                job description. Do not output anything else.
                The job description is as follows: {job_description}
                
                The prospect's resume is as follows: {resume}
        """
        function_descriptions = [
            {
                "name": "extract_resume_ratings",
                "description": "Extract information Score and Summary from resume.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "summary": {
                            "type": "string",
                            "description": "Must extract Only educational qualifications and experiences of resume  related with JD . Do output structured text with max 5-6 sentences. Do not output anything else ",
                        },
                        "score": {
                            "type": "number",
                            "description": "Must evaluate in a scale from 0 to 100 how much the prospect is a fit for the position: [0, 1, 2, ..., 100] 0 being not fit at all and 100 being a perfect fit",
                        }
                    },
                    "required": ["summary", "score"]
                }
            }
        ]
        messages = [{"role": "user", "content": prompt}]

        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        client = OpenAI(
            api_key=OPENAI_API_KEY,
        )

        max_attempts = 5
        attempts = 0
        arguments = None
        summary = None
        score = None
        while attempts < max_attempts and arguments is None and summary is None and score is None:
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                functions=function_descriptions,
                function_call="auto"
            )
            if completion.choices[0].message.function_call is not None:
                arguments = completion.choices[0].message.function_call.arguments
                json_arguments = json.loads(arguments)  
                summary = json_arguments["summary"]
                score = json_arguments["score"]
            attempts += 1
        if arguments is None:
            print("No function call in the response after maximum attempts.")
        return arguments
    except Exception as e:
        print(f"Error in get_score function :{e}")
        return None