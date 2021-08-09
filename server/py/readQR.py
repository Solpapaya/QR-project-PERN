import cgi, os
# import cv2
import os
import sys
import cgitb; cgitb.enable()
import re
import pytesseract
# pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# from pdf2image import convert_from_bytes, convert_from_path
from pdf2image import convert_from_path
from pathlib import Path
from pyzbar import pyzbar
from PIL import Image

# Consider adding this directory to PATH 
# /Library/Frameworks/Python.framework/Versions/3.9/bin

def read_barcodes(img):
   barcodes = pyzbar.decode(img)
   for barcode in barcodes:
      barcode_info = barcode.data.decode('utf-8')
      print(barcode_info)

def read_date(img):
   # Size of the image in pixels (size of orginal image) 
   width, height = img.size 
   # Setting the points for cropped image 
   left = width / 3
   top = 0
   right = width
   bottom = height / 4
   # Cropped image of above dimension 
   # (It will not change orginal image) 
   croppedImg = images[0].crop((left, top, right, bottom)) 
   # Takes Text within the image
   text = pytesseract.image_to_string(croppedImg)
   # Sets Regular Expression for Searching Date
   pattern = re.compile("\d{4}-\d{2}-\d{2}")
   # Searchs pattern in text
   match = pattern.search(text)
   date = match.group()
   print(date)

def delete_file(file):
   os.remove(file)

# Path to temporary PDF
pdfPath = Path(sys.argv[1])

# Windows Path for poppler
# popplerPath = Path("C:/Users/Solpapaya/Desktop/Escom/ServicioSocial/Project/QR-project-PERN/server/py/poppler-21.02.0/Library/bin/")
# pdfPath = Path("C:/xampp/htdocs/SocialService/QR-project/" + sys.argv[1])


# Store PDF with convert_from_path function
try:
   # Windows need Poppler Path
   # images = convert_from_path(pdf_path = pdfPath, poppler_path = popplerPath)

   # Mac doesn't need Poppler Path
   images = convert_from_path(pdf_path = pdfPath)
   read_barcodes(images[0])
   read_date(images[0])
   delete_file(pdfPath)
except:
   print("Python Script Error")


