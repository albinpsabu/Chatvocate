from pathlib import Path
from tempfile import TemporaryDirectory
import pymupdf
from django.test import SimpleTestCase
from .services.pdf_extractor import extract_text_from_pdf
from .services.text_chunker import split_text_into_chunks


class PDFExtractorTests(SimpleTestCase):
    def test_extracts_text_and_page_number(self):
        with TemporaryDirectory() as temp_dir:
            pdf_path=Path(temp_dir)/"sample.pdf"

            with pymupdf.open() as pdf:
                page=pdf.new_page()
                page.insert_text((72,72),"Chatvocate legal test page")
                pdf.save(str(pdf_path))

            pages=extract_text_from_pdf(str(pdf_path))

            self.assertEqual(len(pages),1)
            self.assertEqual(pages[0]["page_number"],1)
            self.assertIn("Chatvocate legal test page",pages[0]["text"])