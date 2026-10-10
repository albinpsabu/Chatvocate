from documents.models import Document, DocumentChunk
from .embedding_service import create_embeddings
from .chroma_service import get_chroma_collection


def index_document_chunks(document_id):
    document = Document.objects.get(id=document_id)

    chunks = list(
        DocumentChunk.objects.filter(
            page__document=document
        ).select_related("page").order_by(
            "page__page_number",
            "chunk_index"
        )
    )

    if not chunks:
        raise ValueError("No document chunks found.")

    collection = get_chroma_collection()

    total_chunks = len(chunks)
    batch_size = 100

    for start in range(0, total_chunks, batch_size):
        batch_chunks = chunks[start:start + batch_size]

        texts = [
            chunk.text for chunk in batch_chunks
        ]

        embeddings = create_embeddings(texts)

        ids = [
            f"doc-{document.id}-page-{chunk.page.page_number}-chunk-{chunk.chunk_index}"
            for chunk in batch_chunks
        ]

        metadatas = [
            {
                "document_id": document.id,
                "document_title": document.title,
                "page_number": chunk.page.page_number,
                "chunk_index": chunk.chunk_index,
            }
            for chunk in batch_chunks
        ]

        collection.upsert(
            ids=ids,
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas
        )

    return {
        "document_id": document.id,
        "chunks_indexed": total_chunks,
        "collection_count": collection.count()
    }