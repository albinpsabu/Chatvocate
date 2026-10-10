from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields=[
            "id",
            "title",
            "file",
            "uploaded_at",
            "processed",
        ]
        read_only_fields=["id","uploaded_at","processed"]
    def validate_file(self,value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("only pdf files are allowed.")



        header=value.read(5)
        value.seek(0)


        if header!=b"%PDF-":
            raise serializers.ValidationError("the uploaded files does not appear to be valid Pdf")
        return value