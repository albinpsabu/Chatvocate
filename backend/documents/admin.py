from django.contrib import admin

from.models import Document


@admin.register(Document)

class DocumentAdmin(admin.ModelAdmin):
    list_display=("id","title","uploaded_at","processed")
    list_filter=('processed',"uploaded_at")
    search_fields=("title",)