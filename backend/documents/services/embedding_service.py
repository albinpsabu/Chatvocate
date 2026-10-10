from django.conf import settings
from openai import OpenAI


def create_embeddings(texts: list[str]) -> list[list[float]]:
    if not settings.OPENAI_API_KEY:
        raise ValueError("OpenAI API key is not configured.")

    if not texts:
        return []

    if any(not text.strip() for text in texts):
        raise ValueError("Text chunks cannot be empty.")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    embeddings = []
    batch_size = 100

    for start in range(0, len(texts), batch_size):
        batch = texts[start:start + batch_size]

        response = client.embeddings.create(
            model=settings.OPENAI_EMBEDDING_MODEL,
            input=batch
        )

        batch_embeddings = sorted(
            response.data,
            key=lambda item: item.index
        )

        embeddings.extend([
            item.embedding for item in batch_embeddings
        ])

    return embeddings