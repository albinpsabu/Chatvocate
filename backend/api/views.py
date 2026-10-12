
import logging

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from documents.services.retrieval_service import search_chunks
from documents.services.answer_generation import generate_answer


logger = logging.getLogger(__name__)


def health_check(request):
    return Response({
        "status": "success",
        "message": "Chatvocate API is running."
    })


class ChatAPIView(APIView):
    # Allow visitors to use the chat without logging in.
    permission_classes = [AllowAny]

    def post(self, request):
        question = request.data.get("question", "")

        # Validate the submitted question.
        if not isinstance(question, str) or not question.strip():
            return Response(
                {"detail": "A non-empty question is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        question = question.strip()

        try:
            # 1. Retrieve relevant legal passages from ChromaDB.
            chunks = search_chunks(question, top_k=8)

            # 2. Generate an answer from the retrieved passages.
            answer = generate_answer(question, chunks)

            # 3. Prepare source references for the frontend.
            sources = []

            for index, chunk in enumerate(chunks, start=1):
                metadata = chunk.get("metadata", {})

                sources.append({
                    "source": index,
                    "document_title": metadata.get(
                        "document_title",
                        "Legal document",
                    ),
                    "page_number": metadata.get("page_number"),
                    "excerpt": chunk.get("text", "")[:500],
                    "distance": chunk.get("distance"),
                })

            # 4. Return the answer and sources as JSON.
            return Response({
                "question": question,
                "answer": answer,
                "sources": sources,
            }, status=status.HTTP_200_OK)

        except Exception:
            # Keep technical details in the server logs.
            logger.exception("Chat request failed.")

            return Response(
                {
                    "detail": (
                        "Unable to generate an answer. "
                        "Please try again."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )
