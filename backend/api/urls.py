from django.urls import path
from .views import health_check
from  documents.views import DocumentListCreateView
urlpatterns=[
    path("health/",health_check,name="health-check"),
    path("documents/",DocumentListCreateView.as_view(),
         name="document-list-create",),
]