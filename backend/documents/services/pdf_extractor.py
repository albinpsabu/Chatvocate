import pymupdf

def extract_text_from_pdf(file_path:str) -> list[dict]:
    """extract text page by page from a PDF file."""

    pages=[]
    with pymupdf.open(file_path) as pdf:
        for page_number,page in enumerate(pdf,start=1):
            text=page.get_text("text").strip()
            if text:
                pages.append({
                    "page_number":page_number,
                    "text":text
                })

    return pages