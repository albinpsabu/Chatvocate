from django.db import models 
class Document(models.Model):
    title=models.CharField(max_length=255)
    file=models.FileField(upload_to="legal_documents/")
    uploaded_at=models.DateTimeField(auto_now_add=True)
    processed=models.BooleanField(default=False)
    def __str__(self):
        return self.title




class DocumentPage(models.Model):
    document=models.ForeignKey(Document,on_delete=models.CASCADE,related_name="pages")
    page_number=models.PositiveIntegerField()
    text=models.TextField()
    class Meta:
        ordering=["page_number"]
        constraints=[models.UniqueConstraint(fields=["document","page_number"],name="unique_document_page")]
        def __str__(self):
            return f"{self.document.title} - Page {self.page_number}"



class DocumentChunk(models.Model):
    page = models.ForeignKey(
        DocumentPage,
        on_delete=models.CASCADE,
        related_name="chunks"
    )
    chunk_index = models.PositiveIntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["page__page_number", "chunk_index"]
        constraints = [
            models.UniqueConstraint(
                fields=["page", "chunk_index"],
                name="unique_page_chunk"
            )
        ]

    def __str__(self):
        return f"{self.page.document.title} - Page {self.page.page_number} - Chunk {self.chunk_index}"