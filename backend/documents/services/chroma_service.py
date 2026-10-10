import chromadb
from django.conf import settings


def get_chroma_collection():
    client = chromadb.PersistentClient(
        path=str(settings.CHROMA_DB_PATH)
    )

    collection = client.get_or_create_collection(
        name="chatvocate_legal_chunks",
        metadata={"hnsw:space": "cosine"}
    )

    return collection


def store_chunks(ids, texts, embeddings, metadatas):
    if not (
        len(ids) == len(texts) == len(embeddings) == len(metadatas)
    ):
        raise ValueError("All input lists must have the same length.")

    if not ids:
        return 0

    collection = get_chroma_collection()

    collection.upsert(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return collection.count()