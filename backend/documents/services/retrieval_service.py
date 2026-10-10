from .embedding_service import create_embeddings
from .chroma_service import get_chroma_collection


def search_chunks(query_text: str, top_k: int = 5) -> list[dict]:
    if not query_text.strip():
        raise ValueError("Search query cannot be empty.")

    if top_k <= 0:
        raise ValueError("top_k must be greater than zero.")

    collection = get_chroma_collection()
    total_chunks = collection.count()

    if total_chunks == 0:
        return []

    query_embedding = create_embeddings([query_text])[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, total_chunks),
        include=["documents", "metadatas", "distances"]
    )

    matches = []

    for chunk_id, text, metadata, distance in zip(
        results["ids"][0],
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        matches.append({
            "id": chunk_id,
            "text": text,
            "metadata": metadata,
            "distance": distance
        })

    return matches