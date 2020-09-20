import base64
from PIL import Image
from io import BytesIO

def decodeBase64(imgString):
    imgdata = (base64.b64decode(imgString))
    filename = './toDetect.jpg'  # I assume you have a way of picking unique filenames
    with open(filename, "wb") as image_file:
        image_file.write(imgdata)
    return filename

