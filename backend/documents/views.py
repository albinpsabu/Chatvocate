from rest_framework import generics 
from  rest_framework.permissions import AllowAny
from .models import Document 
from .serializers import DocumentSerializer
from rest_framework.exceptions import ValidationError
from .services.document_processor import process_document



class DocumentListCreateView(generics.ListCreateAPIView):
    queryset=Document.objects.all().order_by("-uploaded_at")
    serializer_class=DocumentSerializer 
    permission_classes=[AllowAny]



12
class DocumentListCreateView(generics.ListCreateAPIView):
    queryset = Document.objects.all().order_by("-uploaded_at")
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        document = serializer.save()

        try:
            process_document(document)

        except ValueError as exc:
            document.file.delete(save=False)
            document.delete()
            raise ValidationError({"file": str(exc)})




