#!/usr/bin/env python
import string, os, sys, json
from PIL import Image
dir = '/media/photos'
listdict = []
files = os.listdir(dir)  
for f in files:  
    print(dir + os.sep + f)
    im = Image.open(dir + os.sep + f)
    print(im.format, im.size, im.mode)
    listdict.append({'src': 'photos/'+f, 'w': im.size[0], 'h': im.size[1]})

print(json.dumps(listdict))
fileHandle = open ( 'list.json', 'w' )
fileHandle.write (json.dumps(listdict))  
fileHandle.close()
