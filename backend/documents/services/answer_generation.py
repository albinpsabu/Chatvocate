
from django.conf import settings
from openai import OpenAI


def generate_answer(
    question: str,
    retrieved_chunks: list[dict],
) -> str:
    """
    Generate an answer using the legal passages
    retrieved from ChromaDB.
    """

    if not question.strip():
        raise ValueError("Question cannot be empty.")

    if not retrieved_chunks:
        return (
            "I could not find relevant information "
            "in the indexed legal documents to answer "
            "your question."
        )

    if not settings.OPENAI_API_KEY:
        raise ValueError("OpenAI API key is not configured.")

    # Prepare the retrieved legal passages.
    context_parts = []

    for index, chunk in enumerate(retrieved_chunks, start=1):
        metadata = chunk.get("metadata", {})
 
        page_number = metadata.get("page_number", "Unknown")
        document_title = metadata.get(
            "document_title",
            "Legal document",
        )

        context_parts.append(
            f"[Source {index}]\n"
            f"Document: {document_title}\n"
            f"Page: {page_number}\n"
            f"Text: {chunk['text']}"
        )

    context = "\n\n".join(context_parts)

    # Connect to the OpenAI API.
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    # Generate an answer grounded in the retrieved text.
    response = client.responses.create(
        model=settings.OPENAI_CHAT_MODEL,
        instructions=( 
            "You are Chatvocate, a legal document assistant. "
            "Answer the user's question using only the supplied "
            "legal source passages. Do not invent laws, sections, "
            "quotes, or citations. Cite supporting passages using "
            "their source number and document page, for example "
            "'[Source 1, page 94]'. If the sources do not contain "
            "enough information, clearly say so instead of guessing. "
            "Distinguish what the document states from any conclusion "
            "you draw. Do not claim that an old legal document "
            "necessarily reflects the law currently in force."
        ),
        input=(
            f"User question:\n{question}\n\n"
            f"Retrieved legal passages:\n{context}"
        ),
    )

    answer = response.output_text.strip()

    if not answer: 
        raise ValueError("The AI returned an empty answer.")

    return answer
