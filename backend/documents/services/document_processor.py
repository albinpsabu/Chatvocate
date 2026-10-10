from django.db import transaction
from documents.models import DocumentPage, DocumentChunk
from .pdf_extractor import extract_text_from_pdf
from .text_chunker import split_text_into_chunks


def process_document(document):
    pages = extract_text_from_pdf(document.file.path)

    if not pages:
        raise ValueError("No extractable text found in this PDF.")

    with transaction.atomic():
        DocumentPage.objects.filter(document=document).delete()

        total_chunks = 0

        for page in pages:
            document_page = DocumentPage.objects.create(
                document=document,
                page_number=page["page_number"],
                text=page["text"]
            )

            chunks = split_text_into_chunks(page["text"])

            chunk_objects = [
                DocumentChunk(
                    page=document_page,
                    chunk_index=index,
                    text=chunk
                )
                for index, chunk in enumerate(chunks, start=1)
            ]

            DocumentChunk.objects.bulk_create(chunk_objects)

            total_chunks += len(chunks)

        document.processed = True
        document.save(update_fields=["processed"])

    return {
        "pages": len(pages),
        "chunks": total_chunks
    }